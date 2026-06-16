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

type CannotLessOrEqualsThanErrorConstructor = {
  shouldBeGreatherThan: string;
  target: string;
};
export class CannotLessOrEqualsThanError extends Error {
  constructor({
    shouldBeGreatherThan,
    target,
  }: CannotLessOrEqualsThanErrorConstructor) {
    super(`${shouldBeGreatherThan} cannot be less or equals than ${target}.`);
    this.name = 'CannotLessOrEqualsThanError';
  }
}

export class BookAlreadyLoanError extends Error {
  constructor() {
    super('This book is already on loan.');
    this.name = 'BookAlreadyLoanError';
  }
}

export class BookAlreadyReturnedError extends Error {
  constructor() {
    super('This book has already been returned.');
    this.name = 'BookAlreadyReturnedError';
  }
}

export class CannotApproveDisabledLibrarian extends Error {
  constructor() {
    super('Disabled librarian account cannot be approved.');
    this.name = 'CannotApproveDisabledLibrarian';
  }
}
