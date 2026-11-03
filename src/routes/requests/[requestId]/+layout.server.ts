import { error } from '@sveltejs/kit';
import { connectDatabase } from '#lib/server/db.js';
import { getOwner } from '#lib/server/owner.js';
import { ownedRequest } from '#lib/server/requests.js';
import { SalesRequest } from '#lib/server/models/request.js';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies, params }) => {
	const filter = ownedRequest(params.requestId, getOwner(cookies));
	await connectDatabase();
	const request = await SalesRequest.findOne(filter);
	if (!request) error(404, 'Request not found');
	return {
		request: {
			id: request.id,
			pricingUom: request.pricingUom || 'M',
			title: request.title || '',
			description: request.description || '',
			status: request.status,
			visibility: request.visibility,
			due: request.dueAt?.toISOString().slice(0, 10) ?? '',
			questions: request.questions.map((q) => q.label).join('\n'),
			attachments: request.attachments.map((a) => ({
				name: a.name,
				key: a.storageKey,
				size: a.size ?? 0
			}))
		}
	};
};
