import { Schema, model, models, type InferSchemaType, type Model } from 'mongoose';

const questionSchema = new Schema(
	{
		requestId: { type: Schema.Types.ObjectId, ref: 'SalesRequest', required: true, index: true },
		askedBy: { type: String, required: true, trim: true, maxlength: 200 },
		question: { type: String, required: true, trim: true, maxlength: 5000 },
		answer: { type: String, maxlength: 10000 },
		answeredBy: String,
		answeredAt: Date
	},
	{ timestamps: true }
);

export type RequestQuestionDocument = InferSchemaType<typeof questionSchema>;
export const RequestQuestion =
	(models.RequestQuestion as Model<RequestQuestionDocument> | undefined) ??
	model('RequestQuestion', questionSchema);
