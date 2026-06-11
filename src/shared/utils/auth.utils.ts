import * as crypto from 'crypto';
import { sign } from 'jsonwebtoken';

export function createHash(text: string): string {
  return crypto.createHash('sha512').update(text).digest('hex');
}

type CreateTokenInput = {
  payload: object;
  privateKey: string;
};

export function createToken({
  payload,
  privateKey,
}: CreateTokenInput): string | void {
  return sign(payload, privateKey, {
    expiresIn: '7d',
  });
}
