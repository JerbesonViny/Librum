import { decodeToken, isValidToken } from '@/shared';
import {
  infiniteLibrarianJwtTokenMock,
  secretKeyMock,
} from '../../mocks/auth.mocks';

describe('Auth Utils', () => {
  describe('Jwt', () => {
    it('Should decode token', () => {
      const expectedPayload = {
        id: '6a2b3fa1ed358eaafa29055e',
        rule: 'LIBRARIAN',
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
