import { Inject } from '@nestjs/common';
import {
  Create,
  BOOK_REPOSITORY,
  AUTHOR_REPOSITORY,
  FindManyAuthors,
} from '@/domain/contracts/repositories';
import { BookEntity, EntityId } from '@/domain/entities';
import { CreateEntityError, EntityNotFound } from '@/shared/errors';

type Input = {
  title: string;
  description?: string;
  releaseDate: string;
  authorIds: string[];
};

type Output = {
  bookId: string;
};

export class CreateBookUseCase {
  constructor(
    @Inject(BOOK_REPOSITORY)
    private readonly bookRepository: Create<BookEntity, EntityId>,
    @Inject(AUTHOR_REPOSITORY)
    private readonly authorRepository: FindManyAuthors,
  ) {}

  async perform({
    title,
    releaseDate,
    authorIds,
    ...rest
  }: Input): Promise<Output> {
    const authors = await this.authorRepository.findMany({ authorIds });

    if (!authors?.length) {
      throw new EntityNotFound('Author');
    }

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
