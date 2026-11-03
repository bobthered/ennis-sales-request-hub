import { fail, isHttpError, redirect } from '@sveltejs/kit';
import { getOwner } from '#lib/server/owner.js';
import { saveRequest } from '#lib/server/requests.js';
import { connectDatabase } from '#lib/server/db.js';
import type { Actions } from './$types';

export const actions = {
	default: async ({ cookies, params, request }) => {
		const values = await request.formData();
		try {
			await connectDatabase();
			await saveRequest(params.requestId, getOwner(cookies), values, true);
		} catch (e) {
			if (isHttpError(e)) return fail(e.status, { message: e.body.message });
			return fail(503, {
				message: 'Unable to save. Your draft is still available; please try again.'
			});
		}
		redirect(303, `/requests/${params.requestId}`);
	}
} satisfies Actions;
