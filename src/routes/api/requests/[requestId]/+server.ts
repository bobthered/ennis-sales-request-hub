import { error, json } from '@sveltejs/kit';
import { connectDatabase } from '#lib/server/db.js';
import { getOwner } from '#lib/server/owner.js';
import { attachFile, saveRequest } from '#lib/server/requests.js';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, url, params, cookies }) => {
	if (request.headers.get('origin') !== url.origin) error(403, 'Invalid origin');
	await connectDatabase();
	const form = await request.formData();
	if (form.get('operation') === 'upload') {
		const file = form.get('file');
		if (!(file instanceof File)) error(400, 'Choose a file');
		const key = await attachFile(params.requestId, getOwner(cookies), file);
		return json({ key, name: file.name.slice(0, 200), size: file.size });
	}
	await saveRequest(params.requestId, getOwner(cookies), form);
	return json({ saved: true });
};
