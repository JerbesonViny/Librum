import { Inject } from '@nestjs/common';

import { Create, AUTHOR_REPOSITORY } from '@/domain/contracts/repositories';
import { AuthorEntity, EntityId } from '@/domain/entities';
import { CreateEntityError } from '@/shared/errors';

type Input = {
  name: string;
};

type Output = {
  authorId: string;
};

export class CreateAuthorUseCase {
  constructor(
    @Inject(AUTHOR_REPOSITORY)
    private readonly authorRepository: Create<AuthorEntity, EntityId>,
  ) {}

  async perform({ name }: Input): Promise<Output> {
    const author = new AuthorEntity({
      name,
    });

    const authorId = await this.authorRepository.create(author);

    if (!authorId) {
      throw new CreateEntityError('author');
    }

    return { authorId: authorId.toString() };
  }
}
