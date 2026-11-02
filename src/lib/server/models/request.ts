import { Schema, model, models, type InferSchemaType, type Model } from 'mongoose';

const requestSchema = new Schema(
	{
		creatorId: { type: String, required: true, index: true },
		title: { type: String, required: true, trim: true, maxlength: 200 },
		description: { type: String, required: true, maxlength: 20000 },
		status: { type: String, enum: ['draft', 'open', 'closed'], default: 'draft', required: true },
		visibility: {
			type: String,
			enum: ['creator-only', 'shared'],
			default: 'creator-only',
			required: true
		},
		dueAt: Date,
		shareTokenHash: { type: String, select: false },
		questions: [
			{
				label: { type: String, required: true },
				type: { type: String, enum: ['text', 'number', 'textarea'], default: 'text' },
				required: { type: Boolean, default: false }
			}
		],
		attachments: [
			{
				name: { type: String, required: true },
				storageKey: { type: String, required: true },
				contentType: String,
				size: Number
			}
		]
	},
	{ timestamps: true }
);

requestSchema.index({ shareTokenHash: 1 }, { unique: true, sparse: true });
export type SalesRequestDocument = InferSchemaType<typeof requestSchema>;
export const SalesRequest =
	(models.SalesRequest as Model<SalesRequestDocument> | undefined) ??
	model('SalesRequest', requestSchema);
