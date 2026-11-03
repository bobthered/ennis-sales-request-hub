import { responseView } from '#lib/server/response-view.js';
import { randomBytes } from 'node:crypto';
import { fail, isHttpError } from '@sveltejs/kit';
import { connectDatabase } from '#lib/server/db.js';
import { sharedRequest, hashToken } from '#lib/server/sharing.js';
import { RequestResponse } from '#lib/server/models/response.js';
import type { Actions, PageServerLoad } from './$types';
export const load: PageServerLoad = async ({ params, cookies }) => {
	await connectDatabase();
	const r = await sharedRequest(params.token);
	let token = cookies.get(`response-${r.id}`);
	if (!token) {
		token = randomBytes(32).toString('hex');
		cookies.set(`response-${r.id}`, token, {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			maxAge: 31536000
		});
	}
	const own = await RequestResponse.findOne({ requestId: r._id, editTokenHash: hashToken(token) });
	const filter =
		r.visibility === 'shared'
			? { requestId: r._id }
			: token
				? { requestId: r._id, editTokenHash: hashToken(token) }
				: null;
	const rows = filter ? await RequestResponse.find(filter).sort({ createdAt: -1 }) : [];
	return {
		own: own
			? responseView(
					own,
					r.questions.map((q) => q.label)
				)
			: null,
		responses: rows.map((row) =>
			responseView(
				row,
				r.questions.map((q) => q.label)
			)
		)
	};
};
export const actions = {
	default: async ({ params, request, cookies }) => {
		await connectDatabase();
		const r = await sharedRequest(params.token);
		const form = await request.formData();
		const identity = cookies.get(`response-${r.id}`);
		if (!identity) return fail(400, { message: 'Reload this page before submitting.' });
		const existing = await RequestResponse.findOne({
			requestId: r._id,
			editTokenHash: hashToken(identity)
		});
		const editing = form.get('operation') === 'edit';
		if (existing && !editing)
			return fail(409, { message: 'You already submitted a response. Use Edit response.' });
		if (!existing && editing) return fail(404, { message: 'Response not found' });
		try {
			const read = (key: string, max: number, required = false) => {
				const v = form.get(key);
				if (v !== null && typeof v !== 'string') throw new Error('Invalid field');
				const text = ((v as string) || '').trim();
				if (text.length > max || (required && !text))
					throw new Error('Enter your name, branch, and valid pricing');
				return text;
			};
			const noQuote = form.get('disposition') === 'no-quote';
			if (noQuote) {
				await RequestResponse.findOneAndUpdate(
					{ requestId: r._id, editTokenHash: hashToken(identity) },
					{
						$set: {
							disposition: 'no-quote',
							pricingUom: r.pricingUom || 'M',
							name: read('name', 200) || existing?.name || 'Recipient',
							branch: read('branch', 200) || existing?.branch || 'Not provided',
							quantityPrices: []
						},
						$unset: { pricingCents: 1 }
					},
					{ upsert: true, runValidators: true }
				);
				return { success: true };
			}
			const name = read('name', 200, true),
				branch = read('branch', 200, true);
			const money = (key: string) => {
				const value = read(key, 20, true);
				if (!/^\d+(\.\d{1,2})?$/.test(value))
					throw new Error('Enter a price for every quantity, with up to two decimal places');
				const cents = Math.round(Number(value) * 100);
				if (!Number.isSafeInteger(cents)) throw new Error('Pricing is too large');
				return cents;
			};
			const quantityPrices = (r.quantities ?? []).map((quantity) => ({
				quantity,
				cents: money(`price-${quantity}`)
			}));
			const cents = quantityPrices.length ? undefined : money('price');

			const answers: Record<string, string> = { notes: read('notes', 20000) };
			for (let i = 0; i < r.questions.length; i++)
				answers[`Question ${i + 1}`] = read(`question-${i}`, 20000, false);
			const key = `response-${r.id}`;
			const token = cookies.get(key) || randomBytes(32).toString('hex');
			await RequestResponse.findOneAndUpdate(
				{ requestId: r._id, editTokenHash: hashToken(token) },
				{
					$set: {
						disposition: 'quoted',
						name,
						branch,
						quantityPrices,
						pricingCents: cents,
						pricingUom: r.pricingUom || 'M',
						questionLabels: r.questions.map((q) => q.label),
						answers
					}
				},
				{ upsert: true, runValidators: true }
			);
			cookies.set(key, token, {
				path: '/',
				httpOnly: true,
				sameSite: 'lax',
				maxAge: 60 * 60 * 24 * 365
			});
			return { success: true };
		} catch (e) {
			if (isHttpError(e)) throw e;
			return fail(400, { message: e instanceof Error ? e.message : 'Unable to submit response' });
		}
	}
} satisfies Actions;
