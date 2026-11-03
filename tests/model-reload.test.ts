import { expect, it } from 'vitest';
import mongoose from 'mongoose';
it('replaces cached models that predate quantity fields', async () => {
	mongoose.model('SalesRequest', new mongoose.Schema({ title: String }));
	const { SalesRequest } = await import('../src/lib/server/models/request.js');
	const draft = new SalesRequest({ creatorId: 'owner', quantities: [10000, 25000] });
	expect(draft.quantities).toEqual([10000, 25000]);
	mongoose.model('RequestResponse', new mongoose.Schema({ name: String }));
	const { RequestResponse } = await import('../src/lib/server/models/response.js');
	const response = new RequestResponse({
		quantityPrices: [{ quantity: 10000, cents: 12500 }],
		disposition: 'no-quote'
	});
	expect(response.quantityPrices[0].cents).toBe(12500);
	expect(response.disposition).toBe('no-quote');
});
