import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { UsersService } from '../../users/providers/users.service';
import { SignInDto } from './signin.dto';
import { SignInProvider } from './sign-in.provider';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,

    private readonly signingProvider: SignInProvider,
  ) {}

  public async signIn(signInDto: SignInDto) {
    return await this.signingProvider.signIn(signInDto);
  }

  public isAuthenticated() {
    return true;
  }
}
