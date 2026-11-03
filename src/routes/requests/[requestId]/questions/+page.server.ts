import { fail, error } from '@sveltejs/kit';
import { connectDatabase } from '#lib/server/db.js';
import { RequestQuestion } from '#lib/server/models/question.js';
import { sharedRequest } from '#lib/server/sharing.js';
import { SalesRequest } from '#lib/server/models/request.js';
import { ownedRequest } from '#lib/server/requests.js';
import { getOwner } from '#lib/server/owner.js';
import type { PageServerLoad, Actions } from './$types';
export const load: PageServerLoad = async ({ params, cookies }) => {
	await connectDatabase();
	const r = await SalesRequest.findOne(ownedRequest(params.requestId, getOwner(cookies)));
	if (!r) error(404);
	const rows = await RequestQuestion.find({ requestId: r._id }).sort({ createdAt: 1 });
	return {
		questions: rows.map((q) => ({
			id: q.id,
			askedBy: q.askedBy,
			question: q.question,
			answer: q.answer || ''
		}))
	};
};
export const actions = {
	default: async ({ params, cookies, request }) => {
		await connectDatabase();
		const r = await SalesRequest.findOne(ownedRequest(params.requestId, getOwner(cookies)));
		if (!r) error(404);
		if (r.status !== 'open') return fail(400, { message: 'Request is closed' });
		const form = await request.formData();
		const answer = form.get('answer'),
			id = form.get('id');
		if (
			typeof answer !== 'string' ||
			!answer.trim() ||
			answer.length > 10000 ||
			typeof id !== 'string' ||
			!/^[a-f0-9]{24}$/.test(id)
		)
			return fail(400, { message: 'Enter a valid answer' });
		await RequestQuestion.updateOne(
			{ _id: id, requestId: r._id },
			{ $set: { answer: answer.trim(), answeredAt: new Date(), answeredBy: getOwner(cookies) } }
		);
		return { success: true };
	}
} satisfies Actions;
