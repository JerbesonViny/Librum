import { BookEntity, EntityId } from '@/domain/entities';
import { EmptyFieldError, MissingAuthorError } from '@/shared';

describe('BookEntity', () => {
  const validBook = new BookEntity({
    id: new EntityId('6a2b3fa1ed358eaafa29055e'),
    title: 'mockedTitle',
    releaseDate: '20260202',
    authors: ['mocked'],
  });

  describe('Success', () => {
    it('Should update all fields', () => {
      const book = validBook.copy();

      expect(book.getId().toString()).not.toBe(validBook.getId().toString());
      expect(book.getTitle()).toBe(validBook.getTitle());
      expect(book.getDescription()).toBe(validBook.getDescription());
      expect(book.getReleaseDate()).toBe(validBook.getReleaseDate());
      expect(book.getAuthors()).toBe(validBook.getAuthors());

      book.setTitle('new title');
      book.setDescription('new description');
      book.setReleaseDate('20220101');
      book.setAuthors(['new author']);

      expect(book.getTitle()).not.toBe(validBook.getTitle());
      expect(book.getDescription()).not.toBe(validBook.getDescription());
      expect(book.getReleaseDate()).not.toBe(validBook.getReleaseDate());
      expect(book.getAuthors()).not.toBe(validBook.getAuthors());

      expect(book).toEqual({
        id: expect.any(EntityId),
        authors: ['new author'],
        description: 'new description',
        releaseDate: '20220101',
        title: 'new title',
      });
    });

    it('Should update description to undefined', () => {
      const book = { ...validBook, description: 'test' };
      const entity = new BookEntity(book as any);

      expect(entity.getDescription()).toBe('test');
      entity.setDescription(undefined);
      expect(entity.getDescription()).not.toBe('test');
      expect(entity.getDescription()).toBeUndefined();
    });
  });

  describe('Errors', () => {
    it('Should throw error if authors is missing', () => {
      const book = validBook.copy();

      expect(() => {
        book.setAuthors([]);
      }).toThrow(new MissingAuthorError());
    });

    it.each(['title', 'authors', 'releaseDate'])(
      'Should throw error if %s is empty',
      (field) => {
        const book = { ...validBook, [field]: null };
        expect(() => {
          new BookEntity(book as any);
        }).toThrow(new EmptyFieldError(field));
      },
    );
  });
});
