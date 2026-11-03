import { redirect } from '@sveltejs/kit';
import { connectDatabase } from '#lib/server/db.js';
import { getOwner } from '#lib/server/owner.js';
import { startRequest } from '#lib/server/requests.js';
import type { Actions } from './$types';

export const actions = {
	default: async ({ cookies }) => {
		await connectDatabase();
		const draft = await startRequest(getOwner(cookies, true)!);
		redirect(303, `/requests/${draft._id}/edit`);
	}
} satisfies Actions;
