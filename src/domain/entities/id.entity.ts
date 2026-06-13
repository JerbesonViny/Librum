import { randomUUID } from 'node:crypto';

const UUID_V4_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export class EntityId {
  private readonly value: string;

  constructor(id?: string) {
    this.value = id ?? randomUUID().toString();
  }

  equals(other: EntityId): boolean {
    return this.value === other.value;
  }

  static isValid(id: string): boolean {
    return UUID_V4_REGEX.test(id);
  }

  toString() {
    return this.value;
  }
}
