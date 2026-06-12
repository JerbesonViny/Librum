import { UserEntity, UserRoles } from '@/domain/entities';

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');

export type GetUserByEmailInput = {
  email: string;
  role?: UserRoles;
};

export interface GetUserByEmail<T extends UserEntity> {
  getUserByEmail(input: GetUserByEmailInput): Promise<T | null> | T | null;
}
