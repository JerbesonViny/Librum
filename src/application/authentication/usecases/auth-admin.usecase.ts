import { Inject, Injectable } from '@nestjs/common';
import {
  AdminAccessError,
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
import { AdminEntity, UserRoles } from '@/domain/entities';

type Input = {
  email: string;
  password: string;
};

type Output = {
  token: string;
} | null;

@Injectable()
export class AuthAdminUseCase {
  private readonly role: UserRoles = 'ADMIN';

  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: GetUserByEmail<AdminEntity>,
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

    if (user.getRole() !== this.role) {
      throw new AdminAccessError();
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

  private buildToken(user: AdminEntity) {
    return createToken({
      payload: {
        userId: user.getId().toString(),
        role: this.role,
      },
      privateKey: this.configService.get<string>('jwt.secretKey') as string,
    });
  }
}
