import { randomUUID } from 'node:crypto';
import { error } from '@sveltejs/kit';
import { SalesRequest } from './models/request.js';

export function ownedRequest(id: string, creatorId: string | null) {
	if (!creatorId || !/^[a-f\d]{24}$/i.test(id)) error(404, 'Request not found');
	return { _id: id, creatorId };
}

export async function startRequest(creatorId: string) {
	const now = new Date();
	// Delete only explicitly untouched drafts. A changed field/file protects a draft
	// even if an older document is missing the activity marker.
	await SalesRequest.deleteMany({
		creatorId,
		status: 'draft',
		startedAt: null,
		title: '',
		description: '',
		dueAt: null,
		visibility: 'creator-only',
		pricingUom: 'M',
		questions: { $size: 0 },
		attachments: { $size: 0 },
		shareTokenHash: { $exists: false },
		createdAt: { $lt: now }
	});
	return SalesRequest.create({ creatorId });
}

export function parseDetails(form: FormData, final = false) {
	const read = (key: string, max: number) => {
		const value = form.get(key) ?? '';
		if (typeof value !== 'string' || value.length > max) error(400, `Invalid ${key}`);
		return value.trim();
	};
	const title = read('title', 200),
		description = read('description', 20000);
	if (final && (!title || !description)) error(400, 'Enter a project title and project details');
	const visibility = read('visibility', 20);
	if (visibility !== 'creator-only' && visibility !== 'shared') error(400, 'Invalid visibility');
	const pricingUom = read('pricingUom', 2) || 'M';
	if (!['M', 'EA', 'CA', 'RL', 'PK'].includes(pricingUom)) error(400, 'Invalid pricing unit');
	const date = read('due', 10);
	if (
		date &&
		(!/^\d{4}-\d{2}-\d{2}$/.test(date) ||
			Number.isNaN(Date.parse(date)) ||
			new Date(date).toISOString().slice(0, 10) !== date)
	)
		error(400, 'Invalid due date');
	const labels = read('questions', 10000)
		.split('\n')
		.map((q) => q.trim())
		.filter(Boolean);
	if (labels.length > 30 || labels.some((q) => q.length > 500))
		error(400, 'Use up to 30 questions, with 500 characters each');
	return {
		title,
		description,
		visibility,
		pricingUom: pricingUom as 'M' | 'EA' | 'CA' | 'RL' | 'PK',
		dueAt: date ? new Date(date) : null,
		questions: labels.map((label) => ({ label, type: 'text', required: false }))
	};
}

export async function saveRequest(id: string, owner: string | null, form: FormData, final = false) {
	const fields = parseDetails(form, final);
	const result = await SalesRequest.findOneAndUpdate(
		{
			...ownedRequest(id, owner),
			status: { $ne: 'closed' },
			$or: [
				{ status: 'draft' },
				{ pricingUom: fields.pricingUom },
				{ pricingUom: { $exists: false } }
			]
		},
		{ $set: { ...fields, startedAt: new Date(), ...(final ? { status: 'open' } : {}) } },
		{ returnDocument: 'after', runValidators: true }
	);
	if (!result) error(404, 'Request unavailable, closed, or pricing unit changed after publishing');
	return result;
}

export async function attachFile(id: string, owner: string | null, file: File) {
	const maxFile = 1024 * 1024;
	if (!file.size || file.size > maxFile) error(400, 'Choose a non-empty file up to 1 MB');
	const storageKey = randomUUID();
	const result = await SalesRequest.findOneAndUpdate(
		{
			...ownedRequest(id, owner),
			status: { $ne: 'closed' },
			'attachments.9': { $exists: false },
			$expr: { $lte: [{ $sum: '$attachments.size' }, 3 * maxFile - file.size] }
		},
		{
			$set: { startedAt: new Date() },
			$push: {
				attachments: {
					storageKey,
					name: file.name.slice(0, 200),
					contentType: 'application/octet-stream',
					size: file.size,
					data: Buffer.from(await file.arrayBuffer())
				}
			}
		},
		{ returnDocument: 'after', runValidators: true }
	);
	if (!result)
		error(
			400,
			'Upload unavailable. Check that the request is open and has fewer than 10 files and 3 MB total'
		);
	return storageKey;
}
