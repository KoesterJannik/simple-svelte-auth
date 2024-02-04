/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export async function generateJwtToken(payload: any, secret: string, duration: string) {
	return jwt.sign(payload, secret, { expiresIn: duration });
}
export async function verifyJwtToken(token: string, secret: string) {
	const t = await jwt.verify(token, secret);
	// remove the iat and exp properties
	const { iat, exp, ...rest } = t as any;
	return rest;
}
export async function hashPasswordBcrypt(password: string, saltRounds: number) {
	return bcrypt.hash(password, saltRounds);
}
export async function comparePasswordBcrypt(password: string, hash: string) {
	return bcrypt.compare(password, hash);
}
