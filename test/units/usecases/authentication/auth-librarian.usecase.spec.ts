import { AuthLibrarianUseCase } from '@/application/authentication/usecases';

import * as authUtils from '@/shared/utils/auth.utils';
import { UserNotFoundError, WrongPasswordError } from '@/shared';
import { EntityId, LibrarianEntity } from '@/domain/entities';
import { GetUserByEmail } from '@/domain/contracts/repositories';

describe('AuthLibrarianUseCase', () => {
  let useCase: AuthLibrarianUseCase;
  let userRepository: jest.Mocked<GetUserByEmail<LibrarianEntity>>;
  let createHashSpy: jest.SpyInstance;
  let createTokenSpy: jest.SpyInstance;

  const validId = new EntityId('6a2b3fa1ed358eaafa29055e');
  const validEmail = 'mockedEmail';
  const mockedPassword = 'mockedPassword';
  const hashedPassword =
    'cfd5b1652ec2609241b1ac9480ff1b146a068a543a986e1ce8c6d456a919de98b573393282323a94743a04c4b47eb955b51154e77ca9ec3f5c2328572824c17f';
  const defaultEntity = new LibrarianEntity({
    id: validId,
    name: 'mockedName',
    lastName: 'mockedLastName',
    email: validEmail,
    password: hashedPassword,
  });

  beforeAll(() => {
    userRepository = {
      getUserByEmail: jest.fn().mockImplementation(({ email }) => {
        if (email == validEmail) {
          return defaultEntity;
        }

        return null;
      }),
    };
    const configService: any = {
      get: jest.fn().mockReturnValue('123'),
    };

    useCase = new AuthLibrarianUseCase(userRepository, configService);
  });

  beforeEach(() => {
    createHashSpy = jest.spyOn(authUtils, 'createHash');
    createTokenSpy = jest.spyOn(authUtils, 'createToken');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Success', () => {
    it('Should authenticate', async () => {
      createTokenSpy.mockReturnValueOnce('token');

      const response = await useCase.perform({
        email: validEmail,
        password: mockedPassword,
      });

      expect(userRepository.getUserByEmail).toHaveBeenCalledWith({
        email: validEmail,
        role: 'LIBRARIAN',
      });
      expect(createHashSpy).toHaveBeenCalledWith(mockedPassword);
      expect(createHashSpy.mock.results[0].value).toBe(hashedPassword);
      expect(createTokenSpy).toHaveBeenCalledWith({
        payload: {
          userId: defaultEntity.getId().toString(),
          role: 'LIBRARIAN',
        },
        privateKey: '123',
      });

      expect(response).toHaveProperty('token');
      expect(response?.token).not.toBeNull();
      expect(response?.token).toBe('token');
    });
  });

  describe('Errors', () => {
    it("Shouldn't authenticate if token builder was broken", async () => {
      createTokenSpy.mockReturnValueOnce(null);

      const response = await useCase.perform({
        email: validEmail,
        password: mockedPassword,
      });

      expect(response).toBeNull();
    });

    it('Should throw error if user was not found', () => {
      useCase
        .perform({
          email: '123',
          password: mockedPassword,
        })
        .catch((err: Error) => {
          expect(err.message).toBe(new UserNotFoundError().message);
        });

      expect(userRepository.getUserByEmail).toHaveBeenCalledWith({
        email: '123',
        role: 'LIBRARIAN',
      });
      expect(userRepository.getUserByEmail.mock.results[0].value).toBeNull();
    });

    it('Should throw error if password was wrong', () => {
      useCase
        .perform({
          email: validEmail,
          password: '123',
        })
        .catch((err: Error) => {
          expect(err.message).toBe(new WrongPasswordError().message);
        });
    });
  });
});
