import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { Pool } from 'pg';
import { App } from 'supertest/types';

import { AppModule } from '@/app.module';
import { HttpExceptionFilter } from '@/infra/filters/http.filter';
import { DatabaseConnector, DatabaseSeeder } from '../../utils/seeder';
import {
  infiniteAdminJwtTokenMock,
  infiniteLibrarianJwtTokenMock,
  infiniteTenantJwtTokenMock,
} from '../../mocks/auth.mocks';

describe('Librarians Controller', () => {
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
      it('Should create a author', async () => {
        const response = await request(app.getHttpServer())
          .post('/librarian/approve')
          .set({
            authorization: `Bearer ${infiniteAdminJwtTokenMock}`,
          })
          .send({
            librarianId: 'a0000000-0000-4000-a000-000000000004',
          });

        const success = response.body;
        const messageError = response.body?.message;
        expect(messageError).toBeUndefined();
        expect(success).toBeDefined();
        expect(success).toBeTruthy();
      });
    });

    describe('Errors', () => {
      it('Should throw error if tenant user was trying to approve librarian access', async () => {
        const response = await request(app.getHttpServer())
          .post('/librarian/approve')
          .set({ authorization: infiniteTenantJwtTokenMock })
          .send({
            librarianId: 'a0000000-0000-4000-a000-000000000004',
          });

        const body = response.body;
        expect(body.authorId).toBeUndefined();
        expect(body.message).toBe('Admin access is required.');
        expect(body.statusCode).toBe(401);
      });

      it('Should throw error if librarian user was trying to approve librarian access', async () => {
        const response = await request(app.getHttpServer())
          .post('/librarian/approve')
          .set({ authorization: infiniteLibrarianJwtTokenMock })
          .send({
            librarianId: 'a0000000-0000-4000-a000-000000000004',
          });

        const body = response.body;
        expect(body.authorId).toBeUndefined();
        expect(body.message).toBe('Admin access is required.');
        expect(body.statusCode).toBe(401);
      });

      it('Should throw error if token is undefined', async () => {
        const response = await request(app.getHttpServer())
          .post('/librarian/approve')
          .send({
            librarianId: 'a0000000-0000-4000-a000-000000000004',
          });

        const body = response.body;
        expect(body.authorId).toBeUndefined();
        expect(body.message).toBe('Token is required.');
        expect(body.statusCode).toBe(401);
      });

      it('Should throw error if token is invalid', async () => {
        const response = await request(app.getHttpServer())
          .post('/librarian/approve')
          .set({ authorization: 'Bearer invalidToken' })
          .send({
            librarianId: 'a0000000-0000-4000-a000-000000000004',
          });

        const body = response.body;
        expect(body.authorId).toBeUndefined();
        expect(body.message).toBe('Invalid token.');
        expect(body.statusCode).toBe(401);
      });
    });
  });
});
