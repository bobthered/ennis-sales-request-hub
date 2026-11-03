import { connectDatabase } from '#lib/server/db.js';
import { getOwner } from '#lib/server/owner.js';
import { SalesRequest } from '#lib/server/models/request.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
	const creatorId = getOwner(cookies);
	if (!creatorId) return { requests: [] };
	await connectDatabase();
	const requests = await SalesRequest.find({ creatorId })
		.select('title status updatedAt')
		.sort({ updatedAt: -1 })
		.limit(100);
	return {
		requests: requests.map((r) => ({
			id: r.id,
			title: r.title || 'Untitled request',
			status: r.status
		}))
	};
};
