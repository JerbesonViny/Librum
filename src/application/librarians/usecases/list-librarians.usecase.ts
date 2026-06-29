/* eslint-disable @typescript-eslint/no-unused-vars */
import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from '@/domain/contracts/usecases';
import { LibrarianStatus, UserEntity } from '@/domain/entities';
import {
  USER_REPOSITORY,
  PaginatedUsers,
} from '@/domain/contracts/repositories';

type Input = {
  page: number;
  pageSize: number;
  statuses?: LibrarianStatus[];
};

type Output = {
  records: number;
  page: number;
  items: UserEntity[];
};

@Injectable()
export class ListLibrariansUseCase implements UseCase<Input, Output> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: PaginatedUsers,
  ) {}

  async perform({ statuses, ...input }: Input): Promise<Output | null> {
    const response = await this.userRepository.paginate({
      ...input,
      role: 'LIBRARIAN',
      librarian: {
        statuses,
      },
    });

    const librarians = response?.items.map(
      ({ password, ...librarian }: any) => ({
        ...librarian,
      }),
    ) as any[];

    return {
      items: librarians,
      page: response!.page,
      records: response!.records,
    };
  }
}
