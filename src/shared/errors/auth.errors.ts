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
