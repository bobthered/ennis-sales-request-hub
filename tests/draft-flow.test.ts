import { afterAll, beforeAll, expect, it } from 'vitest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { spawn, type ChildProcess } from 'node:child_process';
import mongoose from 'mongoose';

let mongo: MongoMemoryServer;
let app: ChildProcess;
const origin = 'http://127.0.0.1:5189';
beforeAll(async () => {
	mongo = await MongoMemoryServer.create();
	const uri = mongo.getUri('http-flow-tests');
	await mongoose.connect(uri);
	app = spawn(
		process.execPath,
		['node_modules/vite/bin/vite.js', '--host', '127.0.0.1', '--port', '5189', '--strictPort'],
		{
			windowsHide: true,
			stdio: ['ignore', 'pipe', 'pipe'],
			env: { ...process.env, MONGODB_URI: uri }
		}
	);
	await new Promise<void>((resolve, reject) => {
		const timer = setTimeout(() => reject(new Error('Test app did not start')), 60000);
		app.stdout?.on('data', (data) => {
			if (data.toString().includes('Local:')) {
				clearTimeout(timer);
				resolve();
			}
		});
		app.once('exit', (code) => {
			clearTimeout(timer);
			reject(new Error(`Test app exited: ${code}`));
		});
	});
});
afterAll(async () => {
	if (app && app.exitCode === null) {
		await new Promise<void>((resolve) => {
			app.once('exit', () => resolve());
			app.kill();
		});
	}
	await mongoose.disconnect();
	await mongo?.stop();
});

it('creates, autosaves, attaches, cleans up, and reopens through the real HTTP routes', async () => {
	const records = mongoose.connection.collection('salesrequests');
	const getNew = await fetch(`${origin}/requests/new`);
	expect(getNew.status).toBe(200);
	expect(await records.countDocuments()).toBe(0);
	const create = (cookie = '') =>
		fetch(`${origin}/requests/new`, {
			method: 'POST',
			redirect: 'manual',
			headers: {
				Origin: origin,
				Accept: 'text/html',
				Cookie: cookie,
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: ''
		});
	const first = await create();
	expect(first.status).toBe(303);
	const cookie = first.headers.get('set-cookie')!.split(';')[0];
	const editPath = first.headers.get('location')!;
	const id = editPath.split('/')[2];
	expect(await records.countDocuments()).toBe(1);
	const editor = await fetch(origin + editPath, { headers: { Cookie: cookie } });
	expect(editor.status).toBe(200);
	expect(await editor.text()).toContain('Draft created');
	expect((await fetch(origin + editPath)).status).toBe(404);
	const values = new FormData();
	values.set('title', 'Regional print job');
	values.set('description', 'Brochure specifications');
	values.set('visibility', 'shared');
	const autosave = await fetch(`${origin}/api/requests/${id}`, {
		method: 'POST',
		body: values,
		headers: { Cookie: cookie, Origin: origin }
	});
	expect(autosave.status).toBe(200);
	const fileForm = new FormData();
	fileForm.set('operation', 'upload');
	fileForm.set('file', new File(['print specifications'], 'brief.txt'));
	const upload = await fetch(`${origin}/api/requests/${id}`, {
		method: 'POST',
		body: fileForm,
		headers: { Cookie: cookie, Origin: origin }
	});
	expect(upload.status).toBe(200);
	const file = await upload.json();
	const download = await fetch(`${origin}/api/requests/${id}/files/${file.key}`, {
		headers: { Cookie: cookie }
	});
	expect(await download.text()).toBe('print specifications');
	expect((await fetch(`${origin}/api/requests/${id}/files/${file.key}`)).status).toBe(404);
	const untouched = await create(cookie);
	const removedId = untouched.headers.get('location')!.split('/')[2];
	await create(cookie);
	expect(await records.findOne({ _id: new mongoose.Types.ObjectId(removedId) })).toBeNull();
	expect(await records.findOne({ _id: new mongoose.Types.ObjectId(id) })).not.toBeNull();
	const finalSave = await fetch(origin + editPath, {
		method: 'POST',
		body: values,
		redirect: 'manual',
		headers: { Cookie: cookie, Origin: origin, Accept: 'text/html' }
	});
	expect(finalSave.status).toBe(303);
	expect((await records.findOne({ _id: new mongoose.Types.ObjectId(id) }))?.status).toBe('open');
	const list = await fetch(`${origin}/requests`, { headers: { Cookie: cookie } });
	expect(await list.text()).toContain('Regional print job');
}, 90000);
