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
		const decoded = await verifyJwtToken(token, secret);

		expect(decoded.userId).toBe(payload.userId);
		expect('iat' in decoded).toBe(false);
		expect('exp' in decoded).toBe(false);
	});

	it('should hash and compare password', async () => {
		const hash = await hashPasswordBcrypt(password, saltRounds);
		const isMatch = await comparePasswordBcrypt(password, hash);
		expect(isMatch).toBe(true);
	});
});
