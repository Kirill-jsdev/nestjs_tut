import { SetMetadata } from '@nestjs/common';
import { AUTH_TYPE_KEY } from '../constants/auth.constants';
import { AuthTypeEnum } from '../enums/auth-type.enum';

export const Auth = (...authTypes: AuthTypeEnum[]) =>
  SetMetadata(AUTH_TYPE_KEY, authTypes);
