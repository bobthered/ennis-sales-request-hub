import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({
	MONGODB_DB_NAME: {
		description: 'MongoDB database name',
		schema: (value) => value?.trim() || undefined
	},
	MONGODB_URI: {
		description: 'Private MongoDB connection string',
		schema: (value) => value?.trim() || undefined
	}
});
