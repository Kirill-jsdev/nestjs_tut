import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { UsersService } from '../../users/providers/users.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

  public login(email: string, password: string, id: string) {
    const user = this.usersService.findOneById(Number(id));
    console.log('User:', user);
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('ID:', id);

    return 'token';
  }

  public isAuthenticated() {
    return true;
  }
}
