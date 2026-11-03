import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		include: ['tests/**/*.test.ts'],
		pool: 'threads',
		maxWorkers: 1,
		fileParallelism: false,
		hookTimeout: 120000,
		testTimeout: 30000
	}
});
