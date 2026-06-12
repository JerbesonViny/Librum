import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { Db } from 'mongodb';
import { App } from 'supertest/types';

import { AppModule } from '@/app.module';
import { HttpExceptionFilter } from '@/infra/filters/http.filter';
import { EntityId } from '@/domain/entities';
import { DatabaseConnector, DatabaseSeeder } from '../../utils/seeder';
import {
  infiniteLibrarianJwtTokenMock,
  infiniteTenantJwtTokenMock,
} from '../../mocks/auth.mocks';

describe('Books Controller', () => {
  let app: INestApplication<App>;
  let connection: Db;
  let databaseSeeder: DatabaseSeeder;

  beforeAll(async () => {
    connection = (await DatabaseConnector.getInstance()) as Db;
    databaseSeeder = new DatabaseSeeder(connection);
    await databaseSeeder.reset();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalFilters(new HttpExceptionFilter());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    await DatabaseConnector.close();
  });

  describe('Create', () => {
    describe('Success', () => {
      it('Should create a book', async () => {
        const response = await request(app.getHttpServer())
          .post('/books')
          .set({ authorization: infiniteLibrarianJwtTokenMock })
          .send({
            title: 'example title',
            description: 'example description',
            releaseDate: '20250802',
            authors: ['Heisenberg'],
          });

        const bookId = response.body.bookId;
        const messageError = response.body?.message;
        expect(messageError).toBeUndefined();
        expect(bookId).toBeDefined();
        expect(EntityId.isValid(bookId as string)).toBeTruthy();
      });
    });

    describe('Errors', () => {
      it('Should throw error if tenant user was trying to create a new book', async () => {
        const response = await request(app.getHttpServer())
          .post('/books')
          .set({ authorization: infiniteTenantJwtTokenMock })
          .send({
            title: 'example title',
            description: 'example description',
            releaseDate: '20250802',
            authors: ['Heisenberg'],
          });

        const body = response.body;
        expect(body.bookId).toBeUndefined();
        expect(body.message).toBe('Librarian access is required.');
        expect(body.statusCode).toBe(401);
      });

      it('Should throw error if token is undefined', async () => {
        const response = await request(app.getHttpServer())
          .post('/books')
          .send({
            title: 'example title',
            description: 'example description',
            releaseDate: '20250802',
            authors: ['Heisenberg'],
          });

        const body = response.body;
        expect(body.bookId).toBeUndefined();
        expect(body.message).toBe('Token is required.');
        expect(body.statusCode).toBe(401);
      });

      it('Should throw error if token is invalid', async () => {
        const response = await request(app.getHttpServer())
          .post('/books')
          .set({ authorization: 'Bearer invalidToken' })
          .send({
            title: 'example title',
            description: 'example description',
            releaseDate: '20250802',
            authors: ['Heisenberg'],
          });

        const body = response.body;
        expect(body.bookId).toBeUndefined();
        expect(body.message).toBe('Invalid token.');
        expect(body.statusCode).toBe(401);
      });
    });
  });
});
