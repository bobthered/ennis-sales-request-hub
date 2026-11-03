import mongoose, { type InferSchemaType, type Model } from 'mongoose';

const { Schema, model, models } = mongoose;

const requestSchema = new Schema(
	{
		quantities: [{ type: Number, min: 1, validate: Number.isSafeInteger }],
		pricingUom: { type: String, enum: ['M', 'EA', 'CA', 'RL', 'PK'], default: 'M', required: true },
		creatorId: { type: String, required: true, index: true },
		title: { type: String, default: '', trim: true, maxlength: 200 },
		description: { type: String, default: '', maxlength: 20000 },
		startedAt: { type: Date, default: null },
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
				size: Number,
				data: { type: Buffer, select: false }
			}
		]
	},
	{ timestamps: true }
);

requestSchema.index({ shareTokenHash: 1 }, { unique: true, sparse: true });
export type SalesRequestDocument = InferSchemaType<typeof requestSchema>;
// Hot reload may retain a model compiled before these fields existed.
if (
	models.SalesRequest &&
	['quantities', 'pricingUom'].some((path) => !models.SalesRequest.schema.path(path))
)
	mongoose.deleteModel('SalesRequest');
export const SalesRequest: Model<SalesRequestDocument> =
	(models.SalesRequest as Model<SalesRequestDocument> | undefined) ??
	model<SalesRequestDocument>('SalesRequest', requestSchema);
