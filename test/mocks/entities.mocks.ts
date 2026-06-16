import {
  AuthorEntity,
  BookEntity,
  EntityId,
  LibrarianEntity,
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
export const validLibrarianMock = new LibrarianEntity({
  id: entityIdMock,
  name: 'mockedName',
  lastName: 'mockedLastName',
  email: 'mockedEmail',
  password: 'mockedPassword',
  approved: true,
  disabled: false,
  createdAt: new Date('2022-01-01T04:00:00.000Z'),
  approvedAt: new Date('2077-01-01T04:00:00.000Z'),
});
