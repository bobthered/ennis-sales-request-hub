import type { RequestResponseDocument } from './models/response.js';
export function responseView(row: RequestResponseDocument) {
	return {
		name: row.name,
		branch: row.branch,
		price: row.pricingCents == null ? '' : (row.pricingCents / 100).toFixed(2),
		prices: (row.quantityPrices ?? []).map((p) => ({
			quantity: p.quantity,
			price: (p.cents / 100).toFixed(2)
		})),
		uom: row.pricingUom,
		answers: Object.fromEntries(row.answers ?? [])
	};
}
