import mongoose, { type InferSchemaType, type Model } from 'mongoose';

const { Schema, model, models } = mongoose;

const responseSchema = new Schema(
	{
		disposition: { type: String, enum: ['quoted', 'no-quote'], default: 'quoted', required: true },
		requestId: { type: Schema.Types.ObjectId, ref: 'SalesRequest', required: true, index: true },
		name: { type: String, required: true, trim: true, maxlength: 200 },
		branch: { type: String, required: true, trim: true, maxlength: 200 },
		// Store money in integer cents; validate safe integers in the submission service.
		quantityPrices: [
			{
				quantity: { type: Number, required: true, min: 1 },
				cents: { type: Number, required: true, min: 0, validate: Number.isSafeInteger }
			}
		],
		pricingCents: { type: Number, min: 0, validate: Number.isSafeInteger },
		pricingUom: { type: String, enum: ['M', 'EA', 'CA', 'RL', 'PK'], default: 'M', required: true },
		currency: { type: String, default: 'USD' },
		questionLabels: [String],
		answers: { type: Map, of: String },
		editTokenHash: { type: String, required: true, unique: true, select: false }
	},
	{ timestamps: true }
);

export type RequestResponseDocument = InferSchemaType<typeof responseSchema>;
// Hot reload may retain a model compiled before these fields existed.
if (
	models.RequestResponse &&
	['quantityPrices', 'disposition', 'questionLabels'].some(
		(path) => !models.RequestResponse.schema.path(path)
	)
)
	mongoose.deleteModel('RequestResponse');
export const RequestResponse: Model<RequestResponseDocument> =
	(models.RequestResponse as Model<RequestResponseDocument> | undefined) ??
	model<RequestResponseDocument>('RequestResponse', responseSchema);
