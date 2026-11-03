import { connectDatabase } from '#lib/server/db.js';
import { sharedRequest } from '#lib/server/sharing.js';
import type { LayoutServerLoad } from './$types';
export const load: LayoutServerLoad = async ({ params }) => {
	await connectDatabase();
	const r = await sharedRequest(params.token);
	return {
		request: {
			title: r.title,
			description: r.description,
			visibility: r.visibility,
			questions: r.questions.map((q) => q.label),
			due: r.dueAt?.toISOString().slice(0, 10) ?? '',
			attachments: r.attachments.map((a) => ({ name: a.name, key: a.storageKey }))
		}
	};
};
