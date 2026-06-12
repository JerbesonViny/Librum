import { CreateBookUsecase } from '@/application/books/usecases';
import { CreateEntityError } from '@/shared';
import { Create } from '@/domain/contracts/repositories';
import { BookEntity, EntityId } from '@/domain/entities';

describe('CreateBookUsecase', () => {
  let useCase: CreateBookUsecase;
  let bookRepository: jest.Mocked<Create<BookEntity, EntityId>>;

  beforeAll(() => {
    bookRepository = {
      create: jest.fn().mockResolvedValue(null),
    };

    useCase = new CreateBookUsecase(bookRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Errors', () => {
    it('Should throw error if book was not created', () => {
      useCase
        .perform({
          title: 'example',
          description: 'example',
          authors: ['example'],
          releaseDate: '20100202',
        })
        .catch((err: Error) => {
          expect(err.message).toBe(new CreateEntityError('book').message);
        });
    });
  });
});
