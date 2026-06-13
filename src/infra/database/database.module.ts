import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  BookOrmEntity,
  UserOrmEntity,
  TenantOrmEntity,
  LibrarianOrmEntity,
  AuthorOrmEntity,
} from './typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url:
        process.env.POSTGRES_URI ??
        'postgresql://postgres:postgres@localhost:5432/library',
      entities: [
        UserOrmEntity,
        BookOrmEntity,
        TenantOrmEntity,
        LibrarianOrmEntity,
        AuthorOrmEntity,
      ],
      synchronize: process.env.NODE_ENV !== 'production',
    }),
  ],
})
export class DatabaseModule {}
