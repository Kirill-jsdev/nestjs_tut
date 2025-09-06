import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { UsersService } from '../../users/providers/users.service';
import { SignInDto } from './signin.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

  public signIn(signInDto: SignInDto) {
    const { email, password } = signInDto;
    // Implement your signIn logic here
  }

  public isAuthenticated() {
    return true;
  }
}
