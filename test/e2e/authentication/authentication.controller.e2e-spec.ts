import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { Pool } from 'pg';

import { AppModule } from '@/app.module';
import { App } from 'supertest/types';
import { HttpExceptionFilter } from '@/infra/filters/http.filter';
import { DatabaseConnector, DatabaseSeeder } from '../../utils/seeder';

describe('Authentication Controller', () => {
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

  describe('Librarian', () => {
    describe('Success', () => {
      it('Should authenticate', async () => {
        const response = await request(app.getHttpServer())
          .post('/auth/librarian')
          .send({
            email: 'mockedLibrarianEmail',
            password: 'mockedPassword',
          });

        const body = response.body;
        expect(body.message).toBeUndefined();
        expect(body.token).toBeDefined();
      });
    });

    describe('Errors', () => {
      it('Should throw error if user trying sign in wrong path', async () => {
        const response = await request(app.getHttpServer())
          .post('/auth/librarian')
          .send({
            email: 'mockedTenantEmail',
            password: 'mockedPassword',
          });

        const body = response.body;
        expect(body.message).toBe('User not found.');
        expect(body.token).toBeUndefined();
      });
    });
  });
});
