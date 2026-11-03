import { responseView } from '#lib/server/response-view.js';
import { connectDatabase } from '#lib/server/db.js';
import { ownedRequest } from '#lib/server/requests.js';
import { getOwner } from '#lib/server/owner.js';
import { SalesRequest } from '#lib/server/models/request.js';
import { RequestResponse } from '#lib/server/models/response.js';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
export const load: PageServerLoad = async ({ params, cookies }) => {
	await connectDatabase();
	const r = await SalesRequest.findOne(ownedRequest(params.requestId, getOwner(cookies)));
	if (!r) error(404);
	const rows = await RequestResponse.find({ requestId: r._id }).sort({ createdAt: -1 });
	return {
		responses: rows.map(responseView)
	};
};
