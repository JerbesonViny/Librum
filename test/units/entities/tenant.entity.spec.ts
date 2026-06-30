import * as mockdate from 'mockdate';

import { TenantEntity } from '@/domain/entities';
import {
  EmptyFieldError,
  FutureBirthDateError,
  BirthDateFormatError,
  MinimumCharactersPasswordError,
} from '@/shared/errors';
import { entityIdMock, validTenantMock } from '../../mocks';

describe('TenantEntity', () => {
  const defaultValue = 'default';

  beforeAll(() => {
    mockdate.set('2020-01-01');
  });

  afterAll(() => {
    mockdate.reset();
  });

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

    it.each(['2002', '200208090', 'abcd0809', '20021309', '20020132'])(
      'Should throw error if birthDate "%s" has invalid format',
      (birthDate) => {
        expect(() => {
          new TenantEntity({
            id: entityIdMock,
            name: defaultValue,
            lastName: defaultValue,
            password: defaultValue,
            email: defaultValue,
            birthDate,
          });
        }).toThrow(BirthDateFormatError);
      },
    );

    it('Should throw error if birthDate is in the future', () => {
      expect(() => {
        new TenantEntity({
          id: entityIdMock,
          name: defaultValue,
          lastName: defaultValue,
          password: defaultValue,
          email: defaultValue,
          birthDate: '29991231',
        });
      }).toThrow(FutureBirthDateError);
    });

    it('Should throw error if birthDate is today', () => {
      const birthDate = '20200101';

      expect(() => {
        new TenantEntity({
          id: entityIdMock,
          name: defaultValue,
          lastName: defaultValue,
          password: defaultValue,
          email: defaultValue,
          birthDate,
        });
      }).toThrow(FutureBirthDateError);
    });
  });
});
