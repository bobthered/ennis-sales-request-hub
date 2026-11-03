import { createHash } from 'node:crypto';
import { error } from '@sveltejs/kit';
import { SalesRequest } from './models/request.js';
export const hashToken = (token: string) => createHash('sha256').update(token).digest('hex');
export async function sharedRequest(token: string, bytes = false) {
	if (!/^[a-f0-9]{64}$/.test(token)) error(404, 'Request link unavailable');
	const query = SalesRequest.findOne({ shareTokenHash: hashToken(token), status: 'open' });
	if (bytes) query.select('+attachments.data');
	const request = await query;
	if (!request) error(404, 'Request link unavailable');
	return request;
}
