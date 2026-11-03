import type { RequestResponseDocument } from './models/response.js';
export function responseView(row: RequestResponseDocument, labels: string[] = []) {
	const savedLabels = row.questionLabels?.length ? row.questionLabels : labels;
	return {
		disposition: row.disposition || 'quoted',
		name: row.name,
		branch: row.branch,
		price: row.pricingCents == null ? '' : (row.pricingCents / 100).toFixed(2),
		prices: (row.quantityPrices ?? []).map((p) => ({
			quantity: p.quantity,
			price: (p.cents / 100).toFixed(2)
		})),
		uom: row.pricingUom,
		answers: Object.fromEntries(row.answers ?? []),
		questionAnswers: Array.from(row.answers ?? [])
			.filter(([key]) => key !== 'notes')
			.map(([key, answer]) => ({
				label: /^Question \d+$/.test(key) ? savedLabels[Number(key.split(' ')[1]) - 1] || key : key,
				answer
			}))
	};
}
