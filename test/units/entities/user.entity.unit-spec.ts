import { UserEntity } from '@/domain/entities';
import {
  EmptyFieldError,
  MinimumCharactersPasswordError,
} from '@/shared/errors';

describe('UserEntity', () => {
  const defaultValue = 'default';
  const validUser = new UserEntity({
    id: '6a1996fd-cf6a-4999-b9a6-a08a4a2516df',
    name: 'mockedName',
    lastName: 'mockedLastName',
    email: 'mockedEmail',
    password: 'mockedPassword',
  });

  describe('Success', () => {
    it('Should have id field', () => {
      const id = validUser.getId();

      expect(id).toBeDefined();
      expect(id).not.toBeNull();
      expect(id).toBe('6a1996fd-cf6a-4999-b9a6-a08a4a2516df');
    });
  });

  describe('Errors', () => {
    it('Should throw error if password does not contain minimum characters', () => {
      expect(() => {
        new UserEntity({
          email: defaultValue,
          name: defaultValue,
          lastName: defaultValue,
          password: '12',
        });
      }).toThrow(MinimumCharactersPasswordError);
    });

    it.each(['name', 'lastName', 'email'])(
      'Should throw error if %s is empty',
      (field) => {
        const input = {
          id: defaultValue,
          name: defaultValue,
          lastName: defaultValue,
          password: defaultValue,
          email: defaultValue,
          [field]: null,
        };

        expect(() => {
          new UserEntity(input);
        }).toThrow(new EmptyFieldError(field));
      },
    );
  });
});
