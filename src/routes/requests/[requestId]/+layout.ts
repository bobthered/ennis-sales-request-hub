import { error } from '@sveltejs/kit';
import type { RequestSummary } from '#lib/types/request.js';
import type { LayoutLoad } from './$types';
export const load: LayoutLoad<{ request: RequestSummary }> = (): { request: RequestSummary } => {
	// Real request loading will be added with creator ownership checks.
	error(404, 'Request not found');
};
