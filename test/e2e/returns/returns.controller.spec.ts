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
  infiniteAdminJwtTokenMock,
  infiniteLibrarianJwtTokenMock,
  infiniteTenantJwtTokenMock,
} from '../../mocks/auth.mocks';

describe('Returns Controller', () => {
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
      it('Should create returns with librarian token', async () => {
        const response = await request(app.getHttpServer())
          .post('/returns')
          .set({ authorization: infiniteLibrarianJwtTokenMock })
          .send({
            loanId: 'a0000000-0000-4000-a000-000000000001',
          });

        const returnsId = response.body.returnsId;
        const messageError = response.body?.message;
        expect(messageError).toBeUndefined();
        expect(returnsId).toBeDefined();
        expect(EntityId.isValid(returnsId as string)).toBeTruthy();
      });

      it('Should create returns with admin token', async () => {
        const response = await request(app.getHttpServer())
          .post('/returns')
          .set({ authorization: infiniteAdminJwtTokenMock })
          .send({
            loanId: 'a0000000-0000-4000-a000-000000000001',
          });

        const returnsId = response.body.returnsId;
        const messageError = response.body?.message;
        expect(messageError).toBeUndefined();
        expect(returnsId).toBeDefined();
        expect(EntityId.isValid(returnsId as string)).toBeTruthy();
      });
    });

    describe('Errors', () => {
      it('Should throw error if tenant user was trying to create a new return', async () => {
        const response = await request(app.getHttpServer())
          .post('/returns')
          .set({ authorization: infiniteTenantJwtTokenMock })
          .send({
            loanId: 'a0000000-0000-4000-a000-000000000001',
          });

        const body = response.body;
        expect(body.loanId).toBeUndefined();
        expect(body.message).toBe('Librarian or Admin access is required.');
        expect(body.statusCode).toBe(401);
      });

      it('Should throw error if book is already on returns', async () => {
        const response = await request(app.getHttpServer())
          .post('/returns')
          .set({ authorization: infiniteLibrarianJwtTokenMock })
          .send({
            loanId: 'a0000000-0000-4000-a000-000000000002',
          });

        const body = response.body;
        expect(body.loanId).toBeUndefined();
        expect(body.message).toBe('This book has already been returned.');
        // expect(body.statusCode).toBe(401);
      });

      it('Should throw error if token is undefined', async () => {
        const response = await request(app.getHttpServer())
          .post('/returns')
          .send({
            loanId: 'a0000000-0000-4000-a000-000000000001',
          });

        const body = response.body;
        expect(body.loanId).toBeUndefined();
        expect(body.message).toBe('Token is required.');
        expect(body.statusCode).toBe(401);
      });

      it('Should throw error if token is invalid', async () => {
        const response = await request(app.getHttpServer())
          .post('/returns')
          .set({ authorization: 'Bearer invalidToken' })
          .send({
            loanId: 'a0000000-0000-4000-a000-000000000001',
          });

        const body = response.body;
        expect(body.loanId).toBeUndefined();
        expect(body.message).toBe('Invalid token.');
        expect(body.statusCode).toBe(401);
      });
    });
  });
});
