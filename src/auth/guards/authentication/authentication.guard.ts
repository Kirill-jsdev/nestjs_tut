import { type CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { AccessTokenGuard } from '../access-token/access-token.guard';
import { AuthTypeEnum } from 'src/auth/enums/auth-type.enum';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  private static readonly defaultAuthType = AuthTypeEnum.BEARER;
  private readonly authTypeGuardMap: Record<
    AuthTypeEnum,
    CanActivate | CanActivate[]
  >;

  constructor(
    private readonly reflector: Reflector,
    private readonly accessTokenGuard: AccessTokenGuard,
  ) {
    this.authTypeGuardMap = {
      [AuthTypeEnum.BEARER]: this.accessTokenGuard,
      [AuthTypeEnum.NONE]: { canActivate: () => true },
    };
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    console.log(this.authTypeGuardMap);
    return true;
  }
}
