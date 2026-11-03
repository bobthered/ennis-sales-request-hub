import { error } from '@sveltejs/kit';
import type { RequestSummary } from '#lib/types/request.js';
import type { LayoutLoad } from './$types';
export const load: LayoutLoad<{ request: RequestSummary }> = (): { request: RequestSummary } => {
	// Real request loading will validate the recipient link on the server.
	error(404, 'This request link is not available');
};
