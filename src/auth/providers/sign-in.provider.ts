import { forwardRef, Inject, Injectable, RequestTimeoutException, UnauthorizedException } from '@nestjs/common';
import { SignInDto } from './signin.dto';
import { UsersService } from 'src/users/providers/users.service';
import { HashingProvider } from './hashing.provider';
import { JwtService } from '@nestjs/jwt';
import type { ConfigType } from '@nestjs/config';
import jwtConfig from '../config/jwt.config';
import { IActiveUser } from '../interfaces/active-user.interface';

@Injectable()
export class SignInProvider {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,

    private readonly hashingProvider: HashingProvider,

    private readonly jwtService: JwtService,

    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  public async signIn(signInDto: SignInDto) {
    const user = await this.usersService.findUserByEmail(signInDto.email); //no need to check for exception here, as it's handled in the provider

    let isPasswordValid: boolean = false;

    try {
      isPasswordValid = await this.hashingProvider.comparePassword(signInDto.password, user.password);
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'Error during password comparison',
      });
    }

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = await this.jwtService.signAsync({ sub: user.id, email: user.email } as IActiveUser, {
      audience: this.jwtConfiguration.signOptions.audience,
      issuer: this.jwtConfiguration.signOptions.issuer,
      secret: this.jwtConfiguration.secret,
      expiresIn: this.jwtConfiguration.signOptions.expiresIn,
    });

    return { accessToken };
  }
}
