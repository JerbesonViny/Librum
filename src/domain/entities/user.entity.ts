import {
  EmptyFieldError,
  MinimumCharactersPasswordError,
} from '@/shared/errors';
import { EntityId } from './id.entity';

export type UserRoles = 'LIBRARIAN' | 'TENANT' | 'ADMIN';

export type UserConstructor = {
  id?: EntityId;
  name: string;
  lastName: string;
  email: string;
  password: string;
  createdAt?: Date;
};

const MINIMUM_CHARACTERS_PASSWORD = 5;

export abstract class UserEntity {
  protected id: EntityId;
  protected name: string;
  protected lastName: string;
  protected email: string;
  protected password: string;
  protected readonly role: UserRoles;
  protected readonly createdAt: Date;

  constructor({
    id,
    name,
    lastName,
    email,
    password,
    createdAt,
  }: UserConstructor) {
    this.id = id ?? new EntityId();
    this.name = name;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
    this.createdAt = createdAt ?? new Date();
  }

  protected validate() {
    if (this.password.length < MINIMUM_CHARACTERS_PASSWORD) {
      throw new MinimumCharactersPasswordError(MINIMUM_CHARACTERS_PASSWORD);
    }

    if (!this.name) {
      throw new EmptyFieldError('name');
    }

    if (!this.lastName) {
      throw new EmptyFieldError('lastName');
    }

    if (!this.email) {
      throw new EmptyFieldError('email');
    }

    if (!this.role) {
      throw new EmptyFieldError('role');
    }
  }

  setName(name: string): void {
    this.name = name.trim().replaceAll(/[^a-zA-Z]/g, '');
    this.validate();
  }

  setLastName(lastName: string): void {
    this.lastName = lastName.trim().replaceAll(/[^a-zA-Z]/g, '');
    this.validate();
  }

  setEmail(email: string): void {
    this.email = email.trim();
    this.validate();
  }

  setPassword(password: string) {
    this.password = password;
    this.validate();
  }

  getId(): EntityId {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getLastName(): string {
    return this.lastName;
  }

  getEmail(): string {
    return this.email;
  }

  getPassword(): string {
    return this.password;
  }

  getRole(): UserRoles {
    return this.role;
  }
}
