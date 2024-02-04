// auth.test.ts
import { describe, expect, it } from 'vitest';
import {
	generateJwtToken,
	verifyJwtToken,
	hashPasswordBcrypt,
	comparePasswordBcrypt
} from './auth.js';

describe('Auth functions', () => {
	const secret = 'test-secret';
	const expiresIn = '1d';
	const payload = { userId: '123' };
	const password = 'test-password';
	const saltRounds = 10;

	it('should generate and verify JWT token', async () => {
		const token = await generateJwtToken(payload, secret, expiresIn);
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const decoded = (await verifyJwtToken(token, secret)) as any;

		expect(decoded.userId).toBe(payload.userId);
	});

	it('should hash and compare password', async () => {
		const hash = await hashPasswordBcrypt(password, saltRounds);
		const isMatch = await comparePasswordBcrypt(password, hash);
		expect(isMatch).toBe(true);
	});
});
