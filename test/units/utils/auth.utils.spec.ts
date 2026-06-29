import { decodeToken, isValidToken } from '@/shared';
import {
  infiniteLibrarianJwtTokenMock,
  secretKeyMock,
} from '../../mocks/auth.mocks';

describe('Auth Utils', () => {
  describe('Jwt', () => {
    it('Should decode token', () => {
      const expectedPayload = {
        userId: 'a0000000-0000-4000-a000-000000000001',
        role: 'LIBRARIAN',
        iat: 1781277254,
      };
      const decodedToken = decodeToken({
        token: infiniteLibrarianJwtTokenMock,
      });

      expect(decodedToken).toEqual(expectedPayload);
    });

    it('Should be a valid token', () => {
      const valid = isValidToken({
        token: infiniteLibrarianJwtTokenMock,
        privateKey: secretKeyMock,
      });

      expect(valid).toBeTruthy();
    });

    it('Should be a invalid token when secret key is wrong', () => {
      const valid = isValidToken({
        token: infiniteLibrarianJwtTokenMock,
        privateKey: 'wrongSecretKey',
      });

      expect(valid).toBeFalsy();
    });

    it('Should be a invalid token when token is invalid', () => {
      const valid = isValidToken({
        token: 'invalidToken',
        privateKey: secretKeyMock,
      });

      expect(valid).toBeFalsy();
    });
  });
});
