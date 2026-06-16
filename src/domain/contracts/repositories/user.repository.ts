import {
  AdminEntity,
  EntityId,
  LibrarianEntity,
  TenantEntity,
  UserEntity,
  UserRoles,
} from '@/domain/entities';
import { FindOne } from './generic.repository';

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');

export type GetUserByEmailInput = {
  email: string;
  role?: UserRoles;
};

export interface GetUserByEmail<T extends UserEntity> {
  getUserByEmail(input: GetUserByEmailInput): Promise<T | null> | T | null;
}

export type FindOneUserInput = {
  id?: EntityId;
  role?: UserRoles;
};

export interface FindOneUser extends FindOne<
  FindOneUserInput,
  TenantEntity | LibrarianEntity | AdminEntity
> {}

export interface ApproveLibrarianAccess {
  approveLibrarianAccess(entity: LibrarianEntity): Promise<boolean | null>;
}
