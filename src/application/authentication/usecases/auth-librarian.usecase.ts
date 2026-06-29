import { HttpException, Inject, Injectable } from '@nestjs/common';
import {
  LibrarianAccessError,
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
import { LibrarianEntity, UserEntity, UserRoles } from '@/domain/entities';

export type Input = {
  email: string;
  password: string;
};

export type Output = {
  token: string;
} | null;

@Injectable()
export class AuthLibrarianUseCase {
  private readonly role: UserRoles = 'LIBRARIAN';

  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: GetUserByEmail<LibrarianEntity>,
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

    if (!this.isLibrarianGuard(user)) {
      throw new LibrarianAccessError();
    }

    if (user.isDisabled()) {
      throw new HttpException('Disabled librarian.', 401);
    }

    if (!user.isApproved()) {
      throw new HttpException('Unapproved librarian.', 401);
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

  private buildToken(user: LibrarianEntity) {
    return createToken({
      payload: {
        userId: user.getId().toString(),
        role: this.role,
      },
      privateKey: this.configService.get<string>('jwt.secretKey') as string,
    });
  }

  private isLibrarianGuard(user: UserEntity): user is LibrarianEntity {
    return user.getRole() === 'LIBRARIAN';
  }
}
