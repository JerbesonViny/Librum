import { CreateBookUseCase } from '@/application/books/usecases';
import { CreateEntityError } from '@/shared';
import { Create, FindManyAuthors } from '@/domain/contracts/repositories';
import { AuthorEntity, BookEntity, EntityId } from '@/domain/entities';

describe('CreateBookUsecase', () => {
  let useCase: CreateBookUseCase;
  let bookRepository: jest.Mocked<Create<BookEntity, EntityId>>;
  let authorRepository: jest.Mocked<FindManyAuthors>;

  beforeAll(() => {
    bookRepository = {
      create: jest.fn().mockResolvedValue(null),
    };
    authorRepository = {
      findMany: jest
        .fn()
        .mockResolvedValue([new AuthorEntity({ name: 'mock' })]),
    };

    useCase = new CreateBookUseCase(bookRepository, authorRepository);
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
          authorIds: ['exampleId'],
          releaseDate: '20100202',
        })
        .catch((err: Error) => {
          expect(err.message).toBe(new CreateEntityError('book').message);
        });
    });
  });
});
