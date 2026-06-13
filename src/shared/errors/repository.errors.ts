export class CreateEntityError extends Error {
  constructor(entityName: string) {
    super(`Error to create ${entityName}`);
    this.name = 'CreateEntityError';
  }
}

export class PersistenceUserRoleError extends Error {
  constructor() {
    super('User persisted without role.');
    this.name = 'PersistenceUserRoleError';
  }
}

export class EntityNotFound extends Error {
  constructor(entityName: string) {
    super(`${entityName} not found.`);
  }
}
