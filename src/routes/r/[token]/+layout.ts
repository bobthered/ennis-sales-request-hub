import { error } from '@sveltejs/kit';
import { demoRequest } from '#lib/demo.js';
import type { LayoutLoad } from './$types';
export const load: LayoutLoad = ({ params }) => {
	if (params.token !== 'demo') error(404, 'This request link is not available');
	return { request: demoRequest };
};
