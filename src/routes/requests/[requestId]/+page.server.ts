import { createHmac } from 'node:crypto';
import { fail, redirect } from '@sveltejs/kit';
import { connectDatabase } from '#lib/server/db.js';
import { getOwner } from '#lib/server/owner.js';
import { ownedRequest } from '#lib/server/requests.js';
import { hashToken } from '#lib/server/sharing.js';
import { SalesRequest } from '#lib/server/models/request.js';
import type { Actions, PageServerLoad } from './$types';
const tokenFor = (owner: string, id: string) =>
	createHmac('sha256', owner).update(id).digest('hex');
export const load: PageServerLoad = async ({ cookies, params, url }) => {
	await connectDatabase();
	const owner = getOwner(cookies);
	const request = await SalesRequest.findOne(ownedRequest(params.requestId, owner)).select(
		'+shareTokenHash'
	);
	const token = tokenFor(owner!, params.requestId);
	return {
		shareUrl:
			request?.status === 'open' && request.shareTokenHash === hashToken(token)
				? `${url.origin}/r/${token}`
				: ''
	};
};
export const actions = {
	delete: async ({ cookies, params }) => {
		await connectDatabase();
		const result = await SalesRequest.deleteOne(ownedRequest(params.requestId, getOwner(cookies)));
		if (!result.deletedCount) return fail(404, { message: 'Request not found' });
		redirect(303, '/requests');
	},
	share: async ({ cookies, params, url }) => {
		await connectDatabase();
		const owner = getOwner(cookies);
		ownedRequest(params.requestId, owner);
		const token = tokenFor(owner!, params.requestId);
		const request = await SalesRequest.findOneAndUpdate(
			{ ...ownedRequest(params.requestId, getOwner(cookies)), status: 'open' },
			{ $set: { shareTokenHash: hashToken(token) } }
		);
		if (!request) return fail(400, { message: 'Save your request before creating a share link.' });
		return { shareUrl: `${url.origin}/r/${token}` };
	}
} satisfies Actions;
