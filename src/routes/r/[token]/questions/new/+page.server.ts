import { fail, redirect } from '@sveltejs/kit';
import { connectDatabase } from '#lib/server/db.js';
import { sharedRequest } from '#lib/server/sharing.js';
import { RequestQuestion } from '#lib/server/models/question.js';
import type { Actions } from './$types';
export const actions = {
	default: async ({ params, cookies, request }) => {
		await connectDatabase();
		const r = await sharedRequest(params.token);
		if (r.status !== 'open') return fail(400, { message: 'Request is closed' });
		const form = await request.formData();
		const name = form.get('name'),
			question = form.get('question');
		if (
			typeof name !== 'string' ||
			!name.trim() ||
			name.length > 200 ||
			typeof question !== 'string' ||
			!question.trim() ||
			question.length > 5000
		)
			return fail(400, { message: 'Enter your name and question' });
		await RequestQuestion.create({
			requestId: r._id,
			askedBy: name.trim(),
			question: question.trim()
		});
		redirect(303, `/r/${params.token}/questions`);
	}
} satisfies Actions;
