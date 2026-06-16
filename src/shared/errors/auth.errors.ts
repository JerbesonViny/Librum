export class WrongPasswordError extends Error {
  constructor() {
    super('Wrong password.');
    this.name = 'WrongPasswordError';
  }
}

export class UserNotFoundError extends Error {
  constructor() {
    super('User not found.');
    this.name = 'UserNotFoundError';
  }
}

export class EmailAlreadyUsedError extends Error {
  constructor() {
    super('This email is already used.');
    this.name = 'EmailAlreadyUsedError';
  }
}

export class CreateHashError extends Error {
  constructor() {
    super('Error to create hash.');
    this.name = 'CreateHashError';
  }
}

export class AdminAccessError extends Error {
  constructor() {
    super('Admin access is required.');
    this.name = 'AdminAccessError';
  }
}

export class TenantAccessError extends Error {
  constructor() {
    super('Tenant access is required.');
    this.name = 'TenantAccessError';
  }
}

export class LibrarianAccessError extends Error {
  constructor() {
    super('Librarian access is required.');
    this.name = 'LibrarianAccessError';
  }
}
