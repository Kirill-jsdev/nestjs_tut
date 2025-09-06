import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './providers/auth.service';
import { SignInDto } from './providers/signin.dto';
import { Auth } from './decorators/auth.decorator';
import { AuthTypeEnum } from './enums/auth-type.enum';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  @Auth(AuthTypeEnum.NONE)
  public async signIn(@Body() signInDto: SignInDto) {
    //signIn logic here
    return await this.authService.signIn(signInDto);
  }
}
