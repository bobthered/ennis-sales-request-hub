import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { SalesRequest } from '../src/lib/server/models/request.js';
import { attachFile, parseDetails, saveRequest, startRequest } from '../src/lib/server/requests.js';

let mongo: MongoMemoryServer;
beforeAll(async () => {
	mongo = await MongoMemoryServer.create();
	await mongoose.connect(mongo.getUri(), { dbName: 'draft-tests' });
});
afterAll(async () => {
	await mongoose.disconnect();
	await mongo?.stop();
});
beforeEach(async () => {
	await SalesRequest.deleteMany({});
});
const details = (title = '') => {
	const form = new FormData();
	form.set('title', title);
	form.set('description', title ? 'Project details' : '');
	form.set('visibility', 'creator-only');
	form.set('quantities', '10000');
	return form;
};

describe('MongoDB draft lifecycle', () => {
	it('creates a blank draft with a persistent ID', async () => {
		const draft = await startRequest('alice');
		expect(draft.status).toBe('draft');
		expect(draft.startedAt).toBeNull();
		expect(await SalesRequest.findById(draft._id)).not.toBeNull();
	});
	it("deletes only this creator's untouched drafts", async () => {
		const seed = [
			{ creatorId: 'alice' },
			{ creatorId: 'bob' },
			{ creatorId: 'alice', title: 'Work started' },
			{ creatorId: 'alice', startedAt: new Date() },
			{ creatorId: 'alice', status: 'open' },
			{ creatorId: 'alice', status: 'closed' },
			{ creatorId: 'alice', questions: [{ label: 'Lead time?' }] },
			{ creatorId: 'alice', attachments: [{ name: 'brief.pdf', storageKey: 'file', size: 4 }] },
			{ creatorId: 'alice', dueAt: new Date() },
			{ creatorId: 'alice', visibility: 'shared' }
		];
		const docs = await SalesRequest.create(seed);
		await SalesRequest.updateMany(
			{},
			{ $set: { createdAt: new Date('2020-01-01') } },
			{ timestamps: false }
		);
		await startRequest('alice');
		expect(await SalesRequest.findById(docs[0]._id)).toBeNull();
		for (const doc of docs.slice(1)) expect(await SalesRequest.findById(doc._id)).not.toBeNull();
	});
	it('preserves an edited draft even when its text is cleared later', async () => {
		const draft = await startRequest('alice');
		await saveRequest(draft.id, 'alice', details('Started'));
		await saveRequest(draft.id, 'alice', details());
		await startRequest('alice');
		expect(await SalesRequest.findById(draft.id)).not.toBeNull();
	});
	it('persists file bytes before final save and excludes bytes from ordinary reads', async () => {
		const draft = await startRequest('alice');
		const key = await attachFile(draft.id, 'alice', new File(['project brief'], 'brief.txt'));
		const normal = await SalesRequest.findById(draft.id);
		expect(normal?.status).toBe('draft');
		expect(normal?.attachments[0].data).toBeUndefined();
		const loaded = await SalesRequest.findById(draft.id).select('+attachments.data');
		expect(loaded?.attachments[0].storageKey).toBe(key);
		expect(loaded?.attachments[0].data?.toString()).toBe('project brief');
		await startRequest('alice');
		expect(await SalesRequest.findById(draft.id)).not.toBeNull();
	});
	it('rejects updates and uploads for another creator', async () => {
		const draft = await startRequest('alice');
		await expect(saveRequest(draft.id, 'bob', details('Hijacked'))).rejects.toMatchObject({
			status: 404
		});
		await expect(attachFile(draft.id, 'bob', new File(['x'], 'x.txt'))).rejects.toMatchObject({
			status: 400
		});
		expect((await SalesRequest.findById(draft.id))?.title).toBe('');
	});
	it('requires details on final save and retains attachments', async () => {
		const draft = await startRequest('alice');
		await expect(saveRequest(draft.id, 'alice', details(), true)).rejects.toMatchObject({
			status: 400
		});
		await attachFile(draft.id, 'alice', new File(['x'], 'x.txt'));
		const saved = await saveRequest(draft.id, 'alice', details('Print project'), true);
		expect(saved.status).toBe('open');
		expect(saved.attachments).toHaveLength(1);
		await startRequest('alice');
		expect(await SalesRequest.findById(draft.id)).not.toBeNull();
	});
	it('enforces attachment limits atomically with concurrent uploads', async () => {
		const draft = await startRequest('alice');
		const file = new File([new Uint8Array(1024 * 1024)], 'large.bin');
		const results = await Promise.allSettled(
			Array.from({ length: 4 }, () => attachFile(draft.id, 'alice', file))
		);
		expect(results.filter((r) => r.status === 'fulfilled')).toHaveLength(3);
		expect((await SalesRequest.findById(draft.id))?.attachments).toHaveLength(3);
	});
	it('requires a quantity to publish, rejects duplicates, and locks quantities after publishing', async () => {
		const draft = await startRequest('alice');
		const form = details('Job');
		form.delete('quantities');
		await expect(saveRequest(draft.id, 'alice', form, true)).rejects.toMatchObject({ status: 400 });
		form.append('quantities', '10000');
		form.append('quantities', '10000');
		expect(() => parseDetails(form)).toThrow();
		form.set('quantities', '10000');
		await saveRequest(draft.id, 'alice', form, true);
		form.set('quantities', '20000');
		await expect(saveRequest(draft.id, 'alice', form)).rejects.toMatchObject({ status: 404 });
	});
	it('rejects invalid input rather than accepting arbitrary request fields', () => {
		const form = details('Project');
		form.set('due', '2026-02-31');
		expect(() => parseDetails(form)).toThrow();
		form.set('due', '');
		form.set('creatorId', 'bob');
		expect(parseDetails(form)).not.toHaveProperty('creatorId');
	});
});
