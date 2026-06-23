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
import { EmptyFieldError } from '@/shared';

import * as mockdate from 'mockdate';

mockdate.set('2020-01-01T16:00:00.000Z');

describe('Loans Controller', () => {
  let app: INestApplication<App>;
  let connection: Pool;
  let databaseSeeder: DatabaseSeeder;

  beforeAll(async () => {
    connection = DatabaseConnector.getInstance();
    databaseSeeder = new DatabaseSeeder(connection);

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalFilters(new HttpExceptionFilter());
    await app.init();
  });

  beforeEach(async () => {
    await databaseSeeder.reset();
  });

  afterAll(async () => {
    await app.close();
    await DatabaseConnector.close();
  });

  describe('Create', () => {
    describe('Success', () => {
      it('Should create loan', async () => {
        const response = await request(app.getHttpServer())
          .post('/loans')
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
      it('Should throw error if bookId is undefined', async () => {
        const response = await request(app.getHttpServer())
          .post('/loans')
          .set({ authorization: infiniteTenantJwtTokenMock })
          .send({
            userId: 'a0000000-0000-4000-a000-000000000001',
          });

        const loanId = response.body.loanId;
        const messageError = response.body?.message;
        expect(messageError).toBe(new EmptyFieldError('bookId').message);
        expect(loanId).toBeUndefined();
      });

      it('Should throw error if userId is undefined', async () => {
        const response = await request(app.getHttpServer())
          .post('/loans')
          .set({ authorization: infiniteTenantJwtTokenMock })
          .send({
            bookId: 'a0000000-0000-4000-a000-000000000001',
          });

        const loanId = response.body.loanId;
        const messageError = response.body?.message;
        expect(messageError).toBe(new EmptyFieldError('userId').message);
        expect(loanId).toBeUndefined();
      });

      it('Should throw error if librarian user was trying to create a new loan', async () => {
        const response = await request(app.getHttpServer())
          .post('/loans')
          .set({ authorization: infiniteLibrarianJwtTokenMock })
          .send({
            bookId: 'a0000000-0000-4000-a000-000000000002',
            userId: 'a0000000-0000-4000-a000-000000000002',
          });

        const body = response.body;
        expect(body.loanId).toBeUndefined();
        expect(body.message).toBe('Tenant access is required.');
        expect(body.statusCode).toBe(401);
      });

      it('Should throw error if book is already on loan', async () => {
        const response = await request(app.getHttpServer())
          .post('/loans')
          .set({ authorization: infiniteTenantJwtTokenMock })
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
          .post('/loans')
          .set({ authorization: infiniteTenantJwtTokenMock })
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
          .post('/loans')
          .set({ authorization: infiniteTenantJwtTokenMock })
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
        const response = await request(app.getHttpServer())
          .post('/loans')
          .send({
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
          .post('/loans')
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

  describe('List loans by current user', () => {
    describe('Success', () => {
      it('Should list loans', async () => {
        const response = await request(app.getHttpServer())
          .get('/loans/me')
          .set({ authorization: infiniteTenantJwtTokenMock });

        const body = response.body;
        const records = body?.records;
        const messageError = response.body?.message;
        expect(messageError).toBeUndefined();
        expect(records).toBeGreaterThan(0);
        expect(body).toMatchSnapshot();
      });
    });

    describe('Errors', () => {
      it('Should throw error if token is undefined', async () => {
        const response = await request(app.getHttpServer()).get('/loans/me');

        const body = response.body;
        expect(body.loanId).toBeUndefined();
        expect(body.message).toBe('Token is required.');
        expect(body.statusCode).toBe(401);
      });

      it('Should throw error if token is invalid', async () => {
        const response = await request(app.getHttpServer())
          .get('/loans/me')
          .set({ authorization: 'Bearer invalidToken' });

        const body = response.body;
        expect(body.loanId).toBeUndefined();
        expect(body.message).toBe('Invalid token.');
        expect(body.statusCode).toBe(401);
      });
    });
  });

  describe('List', () => {
    describe('Success', () => {
      it('Should list loans', async () => {
        const response = await request(app.getHttpServer())
          .get('/loans')
          .set({ authorization: infiniteLibrarianJwtTokenMock });

        const body = response.body;
        const records = body?.records;
        const messageError = response.body?.message;
        expect(messageError).toBeUndefined();
        expect(records).toBeGreaterThan(0);
        expect(body).toMatchSnapshot();
      });
    });

    describe('Errors', () => {
      it('Should throw error if token is undefined', async () => {
        const response = await request(app.getHttpServer()).get('/loans');

        const body = response.body;
        expect(body.loanId).toBeUndefined();
        expect(body.message).toBe('Token is required.');
        expect(body.statusCode).toBe(401);
      });

      it('Should throw error if token is invalid', async () => {
        const response = await request(app.getHttpServer())
          .get('/loans')
          .set({ authorization: 'Bearer invalidToken' });

        const body = response.body;
        expect(body.loanId).toBeUndefined();
        expect(body.message).toBe('Invalid token.');
        expect(body.statusCode).toBe(401);
      });
    });
  });
});
