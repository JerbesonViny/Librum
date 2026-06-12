export class CreateEntityError extends Error {
  constructor(entityName: string) {
    super(`Error to create ${entityName}`);
    this.name = 'CreateEntityError';
  }
}
