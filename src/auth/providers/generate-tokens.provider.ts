import { Inject, Injectable } from '@nestjs/common';
import { type ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../config/jwt.config';

@Injectable()
export class GenerateTokensProvider {
  constructor(
    private readonly jwtService: JwtService,

    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  public async signToken<T>(userId: number, expiresIn: number, payload?: T) {
    const accessToken = await this.jwtService.signAsync(
      { sub: userId, ...payload },
      {
        audience: this.jwtConfiguration.signOptions.audience,
        issuer: this.jwtConfiguration.signOptions.issuer,
        secret: this.jwtConfiguration.secret,
        expiresIn: expiresIn,
      },
    );

    return accessToken;
  }
}
