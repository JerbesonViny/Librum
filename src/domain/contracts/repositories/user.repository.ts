import { UserEntity } from '@/domain/entities';

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');

export interface GetUserByEmail<T extends UserEntity> {
  getUserByEmail(email: string): Promise<T | null> | T | null;
}
