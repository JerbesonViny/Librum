import * as crypto from 'crypto';
import { decode, sign, verify } from 'jsonwebtoken';

type CreateTokenInput = {
  payload: object;
  privateKey: string;
};

type IsValidToken = {
  token: string;
  privateKey: string;
};

type DecodeToken = { token: string };

export function createHash(text: string): string {
  return crypto.createHash('sha512').update(text).digest('hex');
}

export function createToken({
  payload,
  privateKey,
}: CreateTokenInput): string | void {
  return sign(payload, privateKey, {
    expiresIn: '7d',
  });
}

export function isValidToken({ token, privateKey }: IsValidToken): boolean {
  try {
    return !!verify(token, privateKey);
  } catch {
    return false;
  }
}

export function decodeToken({ token }: DecodeToken): string | object | null {
  try {
    return decode(token);
  } catch {
    return null;
  }
}
