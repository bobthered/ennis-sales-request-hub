import mongoose from 'mongoose';
import { MONGODB_URI, MONGODB_DB_NAME } from '$app/env/private';

type ConnectionCache = { pending: Promise<typeof mongoose> | null };
const serverGlobal = globalThis as typeof globalThis & {
	ennisMongoose?: ConnectionCache;
};

// Survives development hot reloads and warm Vercel function invocations.
const cache = (serverGlobal.ennisMongoose ??= { pending: null });

export async function connectDatabase(): Promise<typeof mongoose> {
	if (!MONGODB_URI) {
		throw new Error('Set MONGODB_URI in .env before using the database.');
	}
	if (cache.pending) return cache.pending;
	if (mongoose.connection.readyState === 1) return mongoose;

	cache.pending = mongoose
		.connect(MONGODB_URI, {
			dbName: MONGODB_DB_NAME,
			maxPoolSize: 10,
			minPoolSize: 0,
			serverSelectionTimeoutMS: 5000,
			bufferCommands: false
		})
		.catch(() => {
			// Do not propagate driver messages that could contain connection details.
			throw new Error(
				'Unable to connect to MongoDB. Check the database configuration and network access.'
			);
		})
		.finally(() => {
			// A rejected connection must not poison subsequent attempts.
			cache.pending = null;
		});
	return cache.pending;
}
