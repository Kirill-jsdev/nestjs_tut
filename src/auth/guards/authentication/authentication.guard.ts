import { type CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { AccessTokenGuard } from '../access-token/access-token.guard';
import { AuthTypeEnum } from 'src/auth/enums/auth-type.enum';
import { AUTH_TYPE_KEY } from 'src/auth/constants/auth.constants';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  private static readonly defaultAuthType = AuthTypeEnum.BEARER;
  private readonly authTypeGuardMap: Record<AuthTypeEnum, CanActivate | CanActivate[]>;

  constructor(
    private readonly reflector: Reflector,
    private readonly accessTokenGuard: AccessTokenGuard,
  ) {
    this.authTypeGuardMap = {
      [AuthTypeEnum.BEARER]: this.accessTokenGuard,
      [AuthTypeEnum.NONE]: { canActivate: () => true },
    };
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const authTypes = this.reflector.getAllAndOverride<AuthTypeEnum[]>(AUTH_TYPE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]) ?? [AuthenticationGuard.defaultAuthType];

    console.log('Auth Types:', authTypes);

    const guards = authTypes.map((type) => this.authTypeGuardMap[type]).flat();
    console.log('Guards to execute:', guards);

    const error = new UnauthorizedException('Unauthorized');

    for (const guard of guards) {
      const canActivate = await Promise.resolve(guard.canActivate(context)).catch((err) => {
        error: err;
      });

      if (canActivate) {
        return true;
      }
    }

    throw error;
  }
}
