import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { Pool } from 'pg';
import { App } from 'supertest/types';

import { AppModule } from '@/app.module';
import { HttpExceptionFilter } from '@/infra/filters/http.filter';
import { EntityId } from '@/domain/entities';
import { DatabaseConnector, DatabaseSeeder } from '../../utils/seeder';
import { EmailAlreadyUsedError } from '../../../src/shared';

describe('Returns Controller', () => {
  const defaultPassword = 'notSoSecretAfterAll';
  const defaultName = 'name';
  const defaultLastName = 'last name';
  const defaultBirthDate = '20200202';
  const usedTenantEmail = 'mockedTenantEmail';
  const usedLibrarianEmail = 'mockedLibrarianEmail';
  const validTenantEmail = 'tenant@example.com';
  const validLibrarianEmail = 'librarian@example.com';

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

  describe('Librarian', () => {
    describe('Success', () => {
      it('Should create librarian', async () => {
        const response = await request(app.getHttpServer())
          .post('/sign-up/librarian')
          .send({
            email: validLibrarianEmail,
            password: defaultPassword,
            name: defaultName,
            lastName: defaultLastName,
          });

        const librarianId = response.body.librarianId;
        const messageError = response.body?.message;
        expect(messageError).toBeUndefined();
        expect(librarianId).toBeDefined();
        expect(EntityId.isValid(librarianId as string)).toBeTruthy();
      });
    });

    describe('Errors', () => {
      it('Should throw error if email is already used', async () => {
        const response = await request(app.getHttpServer())
          .post('/sign-up/librarian')
          .send({
            email: usedLibrarianEmail,
            password: defaultPassword,
            name: defaultName,
            lastName: defaultLastName,
          });

        const librarianId = response.body.librarianId;
        const messageError = response.body?.message;
        expect(messageError).toBe(new EmailAlreadyUsedError().message);
        expect(librarianId).toBeUndefined();
      });
    });
  });

  describe('Tenant', () => {
    describe('Success', () => {
      it('Should create tenant', async () => {
        const response = await request(app.getHttpServer())
          .post('/sign-up/tenant')
          .send({
            email: validTenantEmail,
            password: defaultPassword,
            name: defaultName,
            lastName: defaultLastName,
            birthDate: defaultBirthDate,
          });

        const tenantId = response.body.tenantId;
        const messageError = response.body?.message;
        expect(messageError).toBeUndefined();
        expect(tenantId).toBeDefined();
        expect(EntityId.isValid(tenantId as string)).toBeTruthy();
      });

      it('Should create tenant and login', async () => {
        const createResponse = await request(app.getHttpServer())
          .post('/sign-up/tenant')
          .send({
            email: validTenantEmail,
            password: defaultPassword,
            name: defaultName,
            lastName: defaultLastName,
            birthDate: defaultBirthDate,
          });

        const tenantId = createResponse.body.tenantId;
        const messageError = createResponse.body?.message;
        expect(messageError).toBeUndefined();
        expect(tenantId).toBeDefined();
        expect(EntityId.isValid(tenantId as string)).toBeTruthy();

        const loginResponse = await request(app.getHttpServer())
          .post('/auth/tenant')
          .send({
            email: validTenantEmail,
            password: defaultPassword,
          });

        const body = loginResponse.body;
        expect(body.message).toBeUndefined();
        expect(body.token).toBeDefined();
      });
    });

    describe('Errors', () => {
      it('Should throw error if email is already used', async () => {
        const response = await request(app.getHttpServer())
          .post('/sign-up/tenant')
          .send({
            email: usedTenantEmail,
            password: defaultPassword,
            name: defaultName,
            lastName: defaultLastName,
            birthDate: defaultBirthDate,
          });

        const tenantId = response.body.tenantId;
        const messageError = response.body?.message;
        expect(messageError).toBe(new EmailAlreadyUsedError().message);
        expect(tenantId).toBeUndefined();
      });
    });
  });
});
