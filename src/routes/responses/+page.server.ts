import { createHmac } from 'node:crypto';
import { connectDatabase } from '#lib/server/db.js';
import { hashToken } from '#lib/server/sharing.js';
import { SalesRequest } from '#lib/server/models/request.js';
import { RequestResponse } from '#lib/server/models/response.js';
import type { PageServerLoad } from './$types';
export const load: PageServerLoad = async ({ cookies }) => {
	const identities = cookies
		.getAll()
		.filter((c) => /^response-[a-f0-9]{24}$/.test(c.name) && /^[a-f0-9]{64}$/.test(c.value));
	if (!identities.length) return { responses: [] };
	await connectDatabase();
	const rows = await RequestResponse.find({
		$or: identities.map((c) => ({ requestId: c.name.slice(9), editTokenHash: hashToken(c.value) }))
	}).sort({ updatedAt: -1 });
	const requests = await SalesRequest.find({ _id: { $in: rows.map((r) => r.requestId) } }).select(
		'+shareTokenHash'
	);
	return {
		responses: rows.flatMap((row) => {
			const request = requests.find((r) => r._id.equals(row.requestId));
			if (!request) return [];
			const token = createHmac('sha256', request.creatorId).update(request.id).digest('hex');
			return [
				{
					id: row.id,
					prices: (row.quantityPrices ?? []).map((p) => ({
						quantity: p.quantity,
						price: (p.cents / 100).toFixed(2)
					})),
					title: request.title,
					name: row.name,
					branch: row.branch,
					price: row.quantityPrices?.length
						? row.quantityPrices
								.map((p) => `${p.quantity.toLocaleString('en-US')}: ${(p.cents / 100).toFixed(2)}`)
								.join(' / ')
						: ((row.pricingCents ?? 0) / 100).toFixed(2),
					uom: row.pricingUom,
					status: request.status,
					href:
						request.status === 'open' && request.shareTokenHash === hashToken(token)
							? `/r/${token}`
							: ''
				}
			];
		})
	};
};
