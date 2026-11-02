import { error } from '@sveltejs/kit';
import { demoRequest } from '#lib/demo.js';
import type { LayoutLoad } from './$types';
export const load: LayoutLoad = ({ params }) => {
	if (params.requestId !== 'demo') error(404, 'Request not found');
	return { request: demoRequest };
};
