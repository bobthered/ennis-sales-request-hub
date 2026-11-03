import { error } from '@sveltejs/kit';
import { connectDatabase } from '#lib/server/db.js';
import { sharedRequest } from '#lib/server/sharing.js';
import type { RequestHandler } from './$types';
export const GET: RequestHandler = async ({ params }) => {
	await connectDatabase();
	const r = await sharedRequest(params.token, true);
	const file = r.attachments.find((a) => a.storageKey === params.key);
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
