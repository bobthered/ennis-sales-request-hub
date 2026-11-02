import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
export const load: PageLoad = ({ params }) => {
	if (params.editToken !== 'demo-edit') error(404, 'This edit link is not available');
};
