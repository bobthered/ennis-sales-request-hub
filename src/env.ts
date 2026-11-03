import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({
	MONGODB_URI: {
		description: 'Private MongoDB connection string, including the database name',
		schema: (value) => value?.trim() || undefined
	}
});
