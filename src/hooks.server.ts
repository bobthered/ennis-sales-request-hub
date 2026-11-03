import { building } from '$app/env';
import { MONGODB_URI } from '$app/env/private';
import { error } from '@sveltejs/kit';
import type { Handle } from '@sveltejs/kit/hooks';
import { connectDatabase } from '#lib/server/db.js';

export const handle: Handle = async ({ event, resolve }) => {
	// Keep the current preview usable before credentials are configured.
	// Build/prerender must never depend on a live database.
	if (!building && MONGODB_URI) {
		try {
			await connectDatabase();
		} catch {
			error(503, 'The database is temporarily unavailable. Please try again shortly.');
		}
	}
	return resolve(event);
};
