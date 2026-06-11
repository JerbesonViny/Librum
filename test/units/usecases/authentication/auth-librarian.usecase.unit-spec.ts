import { AuthLibrarianUseCase } from '@/application/authentication/usecases';

import * as authUtils from '@/shared/utils/auth.utils';
import { UserNotFoundError, WrongPasswordError } from '@/shared';
import { LibrarianEntity } from '@/domain/entities/librarian.entity';
import { GetUserByEmail } from '@/domain/contracts/repositories';

describe('AuthLibrarianUseCase', () => {
  let useCase: AuthLibrarianUseCase;
  let userRepository: jest.Mocked<GetUserByEmail<LibrarianEntity>>;
  let createHashSpy: jest.SpyInstance;
  let createTokenSpy: jest.SpyInstance;

  const validId = '6a1996fd-cf6a-4999-b9a6-a08a4a2516df';
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
      getUserByEmail: jest.fn().mockImplementation((email: string) => {
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

      expect(userRepository.getUserByEmail).toHaveBeenCalledWith(validEmail);
      expect(createHashSpy).toHaveBeenCalledWith(mockedPassword);
      expect(createHashSpy.mock.results[0].value).toBe(hashedPassword);
      expect(createTokenSpy).toHaveBeenCalledWith({
        payload: {
          userId: defaultEntity.getId(),
          rule: 'LIBRARIAN',
        },
        privateKey: '123',
      });

      expect(response).toHaveProperty('token');
      expect(response?.token).not.toBeNull();
      expect(response?.token).toBe('token');
    });
  });

  describe('Errors', () => {
    it('Should throw error if user was not found', () => {
      useCase
        .perform({
          email: '123',
          password: mockedPassword,
        })
        .catch((err: Error) => {
          expect(err.message).toBe(new UserNotFoundError().message);
        });

      expect(userRepository.getUserByEmail).toHaveBeenCalledWith('123');
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
