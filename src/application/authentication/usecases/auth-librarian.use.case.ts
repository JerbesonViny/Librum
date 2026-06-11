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
import { LibrarianEntity } from '@/domain/entities';

export type Input = {
  email: string;
  password: string;
};

export type Output = {
  token: string;
} | null;

@Injectable()
export class AuthLibrarianUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: GetUserByEmail<LibrarianEntity>,
    private readonly configService: ConfigService,
  ) {}
  async perform({ email, password }: Input): Promise<Output> {
    const formattedEmail = email.trim();
    const user = await this.userRepository.getUserByEmail(formattedEmail);

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

  private buildToken(user: LibrarianEntity) {
    return createToken({
      payload: {
        userId: user.getId(),
        rule: 'LIBRARIAN',
      },
      privateKey: this.configService.get<string>('jwt.secretKey') as string,
    });
  }
}
