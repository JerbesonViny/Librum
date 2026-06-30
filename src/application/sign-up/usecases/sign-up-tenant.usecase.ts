import { Inject, Injectable } from '@nestjs/common';

import {
  CreateEntityError,
  CreateHashError,
  EmailAlreadyUsedError,
  createHash,
} from '@/shared';
import {
  GetUserByEmail,
  USER_REPOSITORY,
  Create,
} from '@/domain/contracts/repositories';
import { EntityId, TenantEntity, UserRoles } from '@/domain/entities';

type Input = {
  email: string;
  password: string;
  name: string;
  lastName: string;
  birthDate: string;
};

type Output = {
  tenantId: string;
} | null;

@Injectable()
export class SignUpTenantUseCase {
  private readonly role: UserRoles = 'TENANT';

  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: GetUserByEmail<TenantEntity> &
      Create<TenantEntity, EntityId>,
  ) {}
  async perform({
    email,
    password,
    name,
    lastName,
    birthDate,
  }: Input): Promise<Output> {
    const formattedEmail = email.trim();
    const user = await this.userRepository.getUserByEmail({
      email: formattedEmail,
      role: this.role,
    });

    if (user) {
      throw new EmailAlreadyUsedError();
    }

    const tenant = new TenantEntity({
      email: formattedEmail,
      name,
      lastName,
      password,
      birthDate,
    });

    const hashedPassword = createHash(tenant.getPassword());

    if (!hashedPassword) {
      throw new CreateHashError();
    }

    tenant.setPassword(hashedPassword);

    const tenantId = await this.userRepository.create(tenant);

    if (!tenantId) {
      throw new CreateEntityError('Tenant');
    }

    return { tenantId: tenantId.toString() };
  }
}
