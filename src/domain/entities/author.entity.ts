import { EmptyFieldError } from '@/shared';
import { EntityId } from './id.entity';

export type AuthorConstructor = {
  id?: EntityId;
  name: string;
};

export class AuthorEntity {
  private id: EntityId;
  private name: string;

  constructor({ id, name }: AuthorConstructor) {
    this.id = id ?? new EntityId();
    this.name = name;

    this.validate();
  }

  private validate() {
    if (!this.name) {
      throw new EmptyFieldError('name');
    }
  }

  copy() {
    return new AuthorEntity({
      name: this.name,
    });
  }

  setName(name: string) {
    this.name = name;
    this.validate();
  }

  getId() {
    return this.id;
  }

  getName() {
    return this.name;
  }
}
