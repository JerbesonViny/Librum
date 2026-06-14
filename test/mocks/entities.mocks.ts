import {
  AuthorEntity,
  BookEntity,
  EntityId,
  TenantEntity,
} from '../../src/domain/entities';

export const entityIdMock = new EntityId();
export const validAuthorMock = new AuthorEntity({ name: 'mock' });
export const validBookMock = new BookEntity({
  id: new EntityId('6a2b3fa1ed358eaafa29055e'),
  title: 'mockedTitle',
  releaseDate: '20260202',
  authors: [validAuthorMock],
});
export const validTenantMock = new TenantEntity({
  id: entityIdMock,
  name: 'mockedName',
  lastName: 'mockedLastName',
  email: 'mockedEmail',
  password: 'mockedPassword',
  birthDate: '20020809',
});
