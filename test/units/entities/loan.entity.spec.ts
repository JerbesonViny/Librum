import { LoanEntity } from '../../../src/domain/entities';
import { CannotLessOrEqualsThanError } from '../../../src/shared';
import { validBookMock, validTenantMock } from '../../mocks';

describe('LoanEntity', () => {
  describe('Errors', () => {
    it('Should throw error if due date is less than created at', () => {
      expect(() => {
        new LoanEntity({
          book: validBookMock,
          tenant: validTenantMock,
          createdAt: new Date('2026-01-01'),
          dueDate: new Date('2020-01-01'),
        });
      }).toThrow(
        new CannotLessOrEqualsThanError({
          shouldBeGreatherThan: 'dueDate',
          target: 'createdAt',
        }),
      );
    });
  });
});
