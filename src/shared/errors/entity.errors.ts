export class EmptyFieldError extends Error {
  constructor(fieldName: string) {
    super(`The ${fieldName} cannot be empty.`);
    this.name = 'EmptyFieldError';
  }
}

export class MinimumCharactersPasswordError extends Error {
  constructor(charactersQuantity: number) {
    super(
      `Invalid password. Password must contain a minimum of ${charactersQuantity} characters.`,
    );
    this.name = 'MinimumCharactersPasswordError';
  }
}

export class MissingAuthorError extends Error {
  constructor() {
    super('Book must have at least one author.');
    this.name = 'MissingAuthorError';
  }
}
