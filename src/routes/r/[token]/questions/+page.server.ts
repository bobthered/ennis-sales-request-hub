import { error } from '@sveltejs/kit';
import { connectDatabase } from '#lib/server/db.js';
import { RequestQuestion } from '#lib/server/models/question.js';
import { sharedRequest } from '#lib/server/sharing.js';
import { SalesRequest } from '#lib/server/models/request.js';
import { ownedRequest } from '#lib/server/requests.js';
import { getOwner } from '#lib/server/owner.js';
import type { PageServerLoad, Actions } from './$types';
export const load: PageServerLoad = async ({ params, cookies }) => {
	await connectDatabase();
	const r = await sharedRequest(params.token);
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
