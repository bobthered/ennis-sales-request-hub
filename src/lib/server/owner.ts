import { createHash, randomBytes } from 'node:crypto';
import type { Cookies } from '@sveltejs/kit';

const key = 'ennis-owner';
export function getOwner(cookies: Cookies, create = false): string | null {
	let token = cookies.get(key);
	if (!token || !/^[a-f0-9]{64}$/.test(token)) {
		if (!create) return null;
		token = randomBytes(32).toString('hex');
		cookies.set(key, token, {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			maxAge: 60 * 60 * 24 * 365
		});
	}
	return createHash('sha256').update(token).digest('hex');
}
