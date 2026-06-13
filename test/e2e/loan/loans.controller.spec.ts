import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { Pool } from 'pg';
import { App } from 'supertest/types';

import { AppModule } from '@/app.module';
import { HttpExceptionFilter } from '@/infra/filters/http.filter';
import { EntityId } from '@/domain/entities';
import { DatabaseConnector, DatabaseSeeder } from '../../utils/seeder';
import {
  infiniteLibrarianJwtTokenMock,
  infiniteTenantJwtTokenMock,
} from '../../mocks/auth.mocks';

describe('Loans Controller', () => {
  let app: INestApplication<App>;
  let connection: Pool;
  let databaseSeeder: DatabaseSeeder;

  beforeAll(async () => {
    connection = DatabaseConnector.getInstance();
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
      it('Should create loan', async () => {
        const response = await request(app.getHttpServer())
          .post('/loan')
          .set({ authorization: infiniteTenantJwtTokenMock })
          .send({
            bookId: 'a0000000-0000-4000-a000-000000000001',
            userId: 'a0000000-0000-4000-a000-000000000002',
          });

        const loanId = response.body.loanId;
        const messageError = response.body?.message;
        expect(messageError).toBeUndefined();
        expect(loanId).toBeDefined();
        expect(EntityId.isValid(loanId as string)).toBeTruthy();
      });
    });

    describe('Errors', () => {
      it.skip('Should throw error if librarian user was trying to create a new loan', async () => {
        const response = await request(app.getHttpServer())
          .post('/loan')
          .set({ authorization: infiniteLibrarianJwtTokenMock })
          .send({
            title: 'example title',
            description: 'example description',
            releaseDate: '20250802',
            authorIds: ['a0000000-0000-4000-a000-000000000001'],
          });

        const body = response.body;
        expect(body.loanId).toBeUndefined();
        expect(body.message).toBe('Tenant access is required.');
        expect(body.statusCode).toBe(401);
      });

      it('Should throw error if book is already on loan', async () => {
        const response = await request(app.getHttpServer())
          .post('/loan')
          .set({ authorization: infiniteLibrarianJwtTokenMock })
          .send({
            bookId: 'a0000000-0000-4000-a000-000000000002',
            userId: 'a0000000-0000-4000-a000-000000000002',
          });

        const body = response.body;
        expect(body.loanId).toBeUndefined();
        expect(body.message).toBe('This book is already on loan.');
        // expect(body.statusCode).toBe(401);
      });

      it('Should throw error if book is not found', async () => {
        const response = await request(app.getHttpServer())
          .post('/loan')
          .set({ authorization: infiniteLibrarianJwtTokenMock })
          .send({
            bookId: 'a0000000-0000-4000-a000-100000000001',
            userId: 'a0000000-0000-4000-a000-000000000002',
          });

        const body = response.body;
        expect(body.loanId).toBeUndefined();
        expect(body.message).toBe('Book not found.');
        // expect(body.statusCode).toBe(401);
      });

      it('Should throw error if user is not found', async () => {
        const response = await request(app.getHttpServer())
          .post('/loan')
          .set({ authorization: infiniteLibrarianJwtTokenMock })
          .send({
            bookId: 'a0000000-0000-4000-a000-000000000001',
            userId: 'a0000000-0000-4000-a000-100000000002',
          });

        const body = response.body;
        expect(body.loanId).toBeUndefined();
        expect(body.message).toBe('User not found.');
        // expect(body.statusCode).toBe(401);
      });

      it('Should throw error if token is undefined', async () => {
        const response = await request(app.getHttpServer()).post('/loan').send({
          bookId: 'a0000000-0000-4000-a000-000000000003',
          userId: 'a0000000-0000-4000-a000-000000000002',
        });

        const body = response.body;
        expect(body.loanId).toBeUndefined();
        expect(body.message).toBe('Token is required.');
        expect(body.statusCode).toBe(401);
      });

      it('Should throw error if token is invalid', async () => {
        const response = await request(app.getHttpServer())
          .post('/loan')
          .set({ authorization: 'Bearer invalidToken' })
          .send({
            bookId: 'a0000000-0000-4000-a000-000000000003',
            userId: 'a0000000-0000-4000-a000-000000000002',
          });

        const body = response.body;
        expect(body.loanId).toBeUndefined();
        expect(body.message).toBe('Invalid token.');
        expect(body.statusCode).toBe(401);
      });
    });
  });
});
