import { EmptyFieldError, MissingAuthorError } from '@/shared';
import { EntityId } from './id.entity';

export type BookConstructor = {
  id?: EntityId;
  title: string;
  authors: string[];
  releaseDate: string;
  description?: string;
};

export class BookEntity {
  private id: EntityId;
  private title: string;
  private authors: string[];
  private releaseDate: string;
  private description?: string;

  constructor({
    id,
    title,
    authors,
    description,
    releaseDate,
  }: BookConstructor) {
    this.id = id ?? new EntityId();
    this.title = title;
    this.description = description;
    this.authors = authors;
    this.releaseDate = releaseDate;
    this.validate();
  }

  private validate() {
    if (!this.title) {
      throw new EmptyFieldError('title');
    }

    if (!this.authors) {
      throw new EmptyFieldError('authors');
    }

    if (!this.releaseDate) {
      throw new EmptyFieldError('releaseDate');
    }

    if (!this.authors?.length) {
      throw new MissingAuthorError();
    }
  }

  copy() {
    return new BookEntity({
      title: this.title,
      description: this.description,
      authors: this.authors,
      releaseDate: this.releaseDate,
    });
  }

  setTitle(title: string) {
    this.title = title;
    this.validate();
  }

  setDescription(description?: string) {
    this.description = description;
  }

  setAuthors(authors: string[]) {
    this.authors = authors;
    this.validate();
  }

  setReleaseDate(releaseDate: string) {
    this.releaseDate = releaseDate;
    this.validate();
  }

  getId() {
    return this.id;
  }

  getTitle() {
    return this.title;
  }

  getDescription() {
    return this.description;
  }

  getAuthors() {
    return this.authors;
  }

  getReleaseDate() {
    return this.releaseDate;
  }
}
