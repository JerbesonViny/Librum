import { BookConstructor, BookEntity, EntityId } from '@/domain/entities';
import { EmptyFieldError, MissingAuthorError } from '@/shared';
import { validAuthorMock, validBookMock } from '../../mocks';

describe('BookEntity', () => {
  describe('Success', () => {
    it('Should update all fields', () => {
      const book = validBookMock.copy();
      const author = validAuthorMock.copy();
      author.setName('modified author');

      expect(book.getId().toString()).not.toBe(
        validBookMock.getId().toString(),
      );
      expect(book.getTitle()).toBe(validBookMock.getTitle());
      expect(book.getDescription()).toBe(validBookMock.getDescription());
      expect(book.getReleaseDate()).toBe(validBookMock.getReleaseDate());
      expect(book.getAuthors()).toBe(validBookMock.getAuthors());

      book.setTitle('new title');
      book.setDescription('new description');
      book.setReleaseDate('20220101');
      book.setAuthors([author]);

      expect(book.getTitle()).not.toBe(validBookMock.getTitle());
      expect(book.getDescription()).not.toBe(validBookMock.getDescription());
      expect(book.getReleaseDate()).not.toBe(validBookMock.getReleaseDate());
      expect(book.getAuthors()).not.toBe(validBookMock.getAuthors());

      expect(book).toEqual({
        id: expect.any(EntityId),
        authors: [{ ...author }],
        description: 'new description',
        releaseDate: '20220101',
        title: 'new title',
      });
    });

    it('Should update description to undefined', () => {
      const book = {
        ...validBookMock,
        description: 'test',
      } as unknown as BookConstructor;
      const entity = new BookEntity(book);

      expect(entity.getDescription()).toBe('test');
      entity.setDescription(undefined);
      expect(entity.getDescription()).not.toBe('test');
      expect(entity.getDescription()).toBeUndefined();
    });
  });

  describe('Errors', () => {
    it('Should throw error if authors is missing', () => {
      const book = validBookMock.copy();

      expect(() => {
        book.setAuthors([]);
      }).toThrow(new MissingAuthorError());
    });

    it.each(['title', 'authors', 'releaseDate'])(
      'Should throw error if %s is empty',
      (field) => {
        const book = {
          ...validBookMock,
          [field]: null,
        } as unknown as BookConstructor;

        expect(() => {
          new BookEntity(book);
        }).toThrow(new EmptyFieldError(field));
      },
    );
  });
});
