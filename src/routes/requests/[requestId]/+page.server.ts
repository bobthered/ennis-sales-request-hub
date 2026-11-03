import { randomBytes } from 'node:crypto';
import { fail } from '@sveltejs/kit';
import { connectDatabase } from '#lib/server/db.js';
import { getOwner } from '#lib/server/owner.js';
import { ownedRequest } from '#lib/server/requests.js';
import { hashToken } from '#lib/server/sharing.js';
import { SalesRequest } from '#lib/server/models/request.js';
import type { Actions } from './$types';
export const actions = {
	share: async ({ cookies, params, url }) => {
		await connectDatabase();
		const token = randomBytes(32).toString('hex');
		const request = await SalesRequest.findOneAndUpdate(
			{ ...ownedRequest(params.requestId, getOwner(cookies)), status: 'open' },
			{ $set: { shareTokenHash: hashToken(token) } }
		);
		if (!request) return fail(400, { message: 'Save your request before creating a share link.' });
		return { shareUrl: `${url.origin}/r/${token}` };
	}
} satisfies Actions;
