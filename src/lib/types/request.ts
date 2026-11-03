export type RequestSummary = {
	id: string;
	title: string;
	description: string;
	visibility: 'creator-only' | 'shared';
	status: 'draft' | 'open' | 'closed';
};
