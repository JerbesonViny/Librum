import { Inject } from '@nestjs/common';
import { Create, BOOK_REPOSITORY } from '@/domain/contracts/repositories';
import { BookEntity, EntityId } from '@/domain/entities';
import { CreateEntityError } from '@/shared/errors';

type Input = {
  title: string;
  description?: string;
  releaseDate: string;
  authors: string[];
};

type Output = {
  bookId: string;
};

export class CreateBookUsecase {
  constructor(
    @Inject(BOOK_REPOSITORY)
    private readonly bookRepository: Create<BookEntity, EntityId>,
  ) {}

  async perform({
    title,
    authors,
    releaseDate,
    ...rest
  }: Input): Promise<Output> {
    const book = new BookEntity({
      title,
      authors,
      releaseDate,
      description: rest?.description,
    });

    const bookId = await this.bookRepository.create(book);

    if (!bookId) {
      throw new CreateEntityError('book');
    }

    return { bookId: bookId.toString() };
  }
}
