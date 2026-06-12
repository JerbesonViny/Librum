import { Inject, Injectable } from '@nestjs/common';
import {
  UserNotFoundError,
  WrongPasswordError,
  createHash,
  createToken,
} from '@/shared';
import { ConfigService } from '@nestjs/config';
import {
  GetUserByEmail,
  USER_REPOSITORY,
} from '@/domain/contracts/repositories/user.repository';
import { TenantEntity, UserRoles } from '@/domain/entities';

type Input = {
  email: string;
  password: string;
};

type Output = {
  token: string;
} | null;

@Injectable()
export class AuthTenantUseCase {
  private readonly role: UserRoles = 'TENANT';

  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: GetUserByEmail<TenantEntity>,
    private readonly configService: ConfigService,
  ) {}
  async perform({ email, password }: Input): Promise<Output> {
    const formattedEmail = email.trim();
    const user = await this.userRepository.getUserByEmail({
      email: formattedEmail,
      role: this.role,
    });

    if (!user) {
      throw new UserNotFoundError();
    }

    const hashedPassword = createHash(password);

    if (hashedPassword != user.getPassword()) {
      throw new WrongPasswordError();
    }

    const token = this.buildToken(user);

    if (token) {
      return { token };
    }

    return null;
  }

  private buildToken(user: TenantEntity) {
    return createToken({
      payload: {
        userId: user.getId(),
        role: this.role,
      },
      privateKey: this.configService.get<string>('jwt.secretKey') as string,
    });
  }
}
