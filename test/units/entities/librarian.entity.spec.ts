import { LibrarianConstructor, LibrarianEntity } from '@/domain/entities';
import {
  CannotApproveDisabledLibrarian,
  CannotLessOrEqualsThanError,
  EmptyFieldError,
  MinimumCharactersPasswordError,
} from '@/shared/errors';
import { entityIdMock, validLibrarianMock } from '../../mocks';

describe('LibrarianEntity', () => {
  const defaultValue = 'default';

  describe('Success', () => {
    it('Should have id field', () => {
      const id = validLibrarianMock.getId();

      expect(id).toBeDefined();
      expect(id).not.toBeNull();
      expect(entityIdMock.equals(id)).toBeTruthy();
    });

    it('Should update librarian status', () => {
      const librarian = new LibrarianEntity({
        id: entityIdMock,
        name: 'mockedName',
        lastName: 'mockedLastName',
        email: 'mockedEmail',
        password: 'mockedPassword',
        createdAt: new Date('1999-01-01T04:00:00.000Z'),
      });

      expect(librarian.getStatus()).toBe('PENDING_APPROVE');
      expect(librarian.isApproved()).toBeFalsy();
      expect(librarian.isDisabled()).toBeFalsy();
      expect(librarian.getApprovedAt()).toBeUndefined();
      expect(librarian.getDisabledAt()).toBeUndefined();

      librarian.markApproved();

      expect(librarian.getStatus()).toBe('APPROVED');
      expect(librarian.isApproved()).toBeTruthy();
      expect(librarian.isDisabled()).toBeFalsy();
      expect(librarian.getApprovedAt()).toBeDefined();
      expect(librarian.getDisabledAt()).toBeUndefined();

      librarian.markDisabled();

      expect(librarian.getStatus()).toBe('DISABLED');
      expect(librarian.isApproved()).toBeTruthy();
      expect(librarian.isDisabled()).toBeTruthy();
      expect(librarian.getApprovedAt()).toBeDefined();
      expect(librarian.getDisabledAt()).toBeDefined();
    });
  });

  describe('Errors', () => {
    it('Should throw error if try approve disabled librarian', () => {
      const librarian = new LibrarianEntity({
        id: entityIdMock,
        name: 'mockedName',
        lastName: 'mockedLastName',
        email: 'mockedEmail',
        password: 'mockedPassword',
        approved: false,
        disabled: true,
        createdAt: new Date('2022-01-01T04:00:00.000Z'),
        disabledAt: new Date('2077-01-01T04:00:00.000Z'),
      });

      expect(() => {
        librarian.markApproved();
      }).toThrow(CannotApproveDisabledLibrarian);
    });

    it('Should throw error if createdAt is less than disabledAt', () => {
      expect(() => {
        new LibrarianEntity({
          id: entityIdMock,
          name: 'mockedName',
          lastName: 'mockedLastName',
          email: 'mockedEmail',
          password: 'mockedPassword',
          approved: false,
          disabled: true,
          disabledAt: new Date('2022-01-01T04:00:00.000Z'),
          createdAt: new Date('2077-01-01T04:00:00.000Z'),
        });
      }).toThrow(
        new CannotLessOrEqualsThanError({
          shouldBeGreatherThan: 'disabledAt',
          target: 'createdAt',
        }),
      );
    });

    it('Should throw error if createdAt is less than approvedAt', () => {
      expect(() => {
        new LibrarianEntity({
          id: entityIdMock,
          name: 'mockedName',
          lastName: 'mockedLastName',
          email: 'mockedEmail',
          password: 'mockedPassword',
          approved: true,
          disabled: false,
          approvedAt: new Date('2022-01-01T04:00:00.000Z'),
          createdAt: new Date('2077-01-01T04:00:00.000Z'),
        });
      }).toThrow(
        new CannotLessOrEqualsThanError({
          shouldBeGreatherThan: 'approvedAt',
          target: 'createdAt',
        }),
      );
    });

    it('Should throw error if password does not contain minimum characters', () => {
      expect(() => {
        const copy = { ...validLibrarianMock };

        new LibrarianEntity({
          ...copy,
          password: '12',
        } as unknown as LibrarianConstructor);
      }).toThrow(MinimumCharactersPasswordError);
    });

    it.each(['name', 'lastName', 'email', 'approvedAt'])(
      'Should throw error if %s is empty',
      (field) => {
        const input = {
          id: entityIdMock,
          name: defaultValue,
          lastName: defaultValue,
          password: defaultValue,
          email: defaultValue,
          approved: true,
          disabled: false,
          approvedAt: new Date('2027-01-01T03:00:00.000Z'),
          createdAt: new Date('2022-01-01T03:00:00.000Z'),
          [field]: null,
        };

        expect(() => {
          new LibrarianEntity(input);
        }).toThrow(new EmptyFieldError(field));
      },
    );

    it('Should throw error if user is disabled but disabledAt field is empty', () => {
      const input = {
        id: entityIdMock,
        name: defaultValue,
        lastName: defaultValue,
        password: defaultValue,
        email: defaultValue,
        approved: false,
        disabled: true,
        createdAt: new Date('2022-01-01T03:00:00.000Z'),
      };

      expect(() => {
        new LibrarianEntity(input);
      }).toThrow(new EmptyFieldError('disabledAt'));
    });
  });
});
