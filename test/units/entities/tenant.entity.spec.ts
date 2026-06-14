import { TenantEntity } from '@/domain/entities';
import {
  EmptyFieldError,
  MinimumCharactersPasswordError,
} from '@/shared/errors';
import { entityIdMock, validTenantMock } from '../../mocks';

describe('TenantEntity', () => {
  const defaultValue = 'default';

  describe('Success', () => {
    it('Should have id field', () => {
      const id = validTenantMock.getId();

      expect(id).toBeDefined();
      expect(id).not.toBeNull();
      expect(entityIdMock.equals(id)).toBeTruthy();
    });
  });

  describe('Errors', () => {
    it('Should throw error if password does not contain minimum characters', () => {
      expect(() => {
        new TenantEntity({
          email: defaultValue,
          name: defaultValue,
          lastName: defaultValue,
          birthDate: '20020809',
          password: '12',
        });
      }).toThrow(MinimumCharactersPasswordError);
    });

    it.each(['name', 'lastName', 'email', 'birthDate'])(
      'Should throw error if %s is empty',
      (field) => {
        const input = {
          id: entityIdMock,
          name: defaultValue,
          lastName: defaultValue,
          password: defaultValue,
          email: defaultValue,
          birthDate: '20020809',
          [field]: null,
        };

        expect(() => {
          new TenantEntity(input);
        }).toThrow(new EmptyFieldError(field));
      },
    );
  });
});
