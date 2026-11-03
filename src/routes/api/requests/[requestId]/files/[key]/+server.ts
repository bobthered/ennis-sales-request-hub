import { error } from '@sveltejs/kit';
import { connectDatabase } from '#lib/server/db.js';
import { getOwner } from '#lib/server/owner.js';
import { ownedRequest } from '#lib/server/requests.js';
import { SalesRequest } from '#lib/server/models/request.js';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ cookies, params }) => {
	const filter = ownedRequest(params.requestId, getOwner(cookies));
	await connectDatabase();
	const record = await SalesRequest.findOne(filter).select('+attachments.data');
	const file = record?.attachments.find((a) => a.storageKey === params.key);
	if (!file?.data) error(404, 'File not found');
	return new Response(new Uint8Array(file.data), {
		headers: {
			'Content-Type': 'application/octet-stream',
			'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(file.name)}`,
			'Cache-Control': 'private, no-store',
			'X-Content-Type-Options': 'nosniff'
		}
	});
};
