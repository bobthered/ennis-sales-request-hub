import { randomBytes } from 'node:crypto';
import { fail, isHttpError } from '@sveltejs/kit';
import { connectDatabase } from '#lib/server/db.js';
import { sharedRequest, hashToken } from '#lib/server/sharing.js';
import { RequestResponse } from '#lib/server/models/response.js';
import type { Actions, PageServerLoad } from './$types';
export const load: PageServerLoad = async ({ params, cookies }) => {
	await connectDatabase();
	const r = await sharedRequest(params.token);
	const token = cookies.get(`response-${r.id}`);
	const filter =
		r.visibility === 'shared'
			? { requestId: r._id }
			: token
				? { requestId: r._id, editTokenHash: hashToken(token) }
				: null;
	const rows = filter ? await RequestResponse.find(filter).sort({ createdAt: -1 }) : [];
	return {
		responses: rows.map((row) => ({
			name: row.name,
			branch: row.branch,
			price: row.pricingCents == null ? '' : (row.pricingCents / 100).toFixed(2),
			uom: row.pricingUom,
			answers: Object.fromEntries(row.answers ?? [])
		}))
	};
};
export const actions = {
	default: async ({ params, request, cookies }) => {
		await connectDatabase();
		const r = await sharedRequest(params.token);
		const form = await request.formData();
		try {
			const read = (key: string, max: number, required = false) => {
				const v = form.get(key);
				if (v !== null && typeof v !== 'string') throw new Error('Invalid field');
				const text = ((v as string) || '').trim();
				if (text.length > max || (required && !text))
					throw new Error('Enter your name, branch, and valid pricing');
				return text;
			};
			const name = read('name', 200, true),
				branch = read('branch', 200, true),
				price = read('price', 20, true);
			if (!/^\d+(\.\d{1,2})?$/.test(price))
				throw new Error('Enter pricing with up to two decimal places');
			const cents = Math.round(Number(price) * 100);
			if (!Number.isSafeInteger(cents)) throw new Error('Pricing is too large');
			const answers: Record<string, string> = { notes: read('notes', 20000) };
			for (let i = 0; i < r.questions.length; i++)
				answers[`Question ${i + 1}`] = read(`question-${i}`, 20000, r.questions[i].required);
			const key = `response-${r.id}`;
			const token = cookies.get(key) || randomBytes(32).toString('hex');
			await RequestResponse.findOneAndUpdate(
				{ requestId: r._id, editTokenHash: hashToken(token) },
				{ $set: { name, branch, pricingCents: cents, pricingUom: r.pricingUom || 'M', answers } },
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
