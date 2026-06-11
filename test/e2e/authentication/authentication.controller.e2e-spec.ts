import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from '@/app.module';
import { App } from 'supertest/types';
import { HttpExceptionFilter } from '@/infra/filters/http.filter';
import { DatabaseConnector, DatabaseSeeder } from '../../utils/seeder';
import { Db } from 'mongodb';

describe('Authentication Controller', () => {
  let app: INestApplication<App>;
  let connection: Db;
  let databaseSeeder: DatabaseSeeder;

  beforeAll(async () => {
    connection = (await DatabaseConnector.getInstance()) as Db;
    databaseSeeder = new DatabaseSeeder(connection as any);
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
    it('Should authenticate', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/librarian')
        .send({
          email: 'mockedEmail',
          password: 'mockedPassword',
        });

      expect(response.body.token).toBeDefined();
    });
  });
});
