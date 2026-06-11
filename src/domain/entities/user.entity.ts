import { randomUUID } from 'crypto';
import {
  EmptyFieldError,
  MinimumCharactersPasswordError,
} from '@/shared/errors';

export type UserId = string;

export type UserConstructor = {
  id?: string;
  name: string;
  lastName: string;
  email: string;
  password: string;
};

const MINIMUM_CHARACTERS_PASSWORD = 5;

export class UserEntity {
  private id: UserId;
  private name: string;
  private lastName: string;
  private email: string;
  private password: string;

  constructor({ id, name, lastName, email, password }: UserConstructor) {
    this.id = id ?? randomUUID().toString();
    this.name = name;
    this.lastName = lastName;
    this.email = email;
    this.password = password;

    this.validate();
  }

  private validate() {
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

  getId(): UserId {
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
}
