import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { PatchUserDto } from './dtos/patch-user.dto';
import { UsersService } from './providers/users.service';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateManyUsersDto } from './dtos/create-many-users.dto';
import { AccessTokenGuard } from 'src/auth/guards/access-token/access-token.guard';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { AuthTypeEnum } from 'src/auth/enums/auth-type.enum';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    // inject UserService
    private readonly userService: UsersService,
  ) {}

  @Get('{/:id}')
  @ApiOperation({ summary: 'Fetches a list of users' })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of users based on the query',
  })
  @ApiQuery({
    name: 'limit',
    type: 'number',
    required: false,
    example: 10,
    description: 'Number of users to return',
  })
  @ApiQuery({
    name: 'page',
    type: 'number',
    required: false,
    example: 1,
    description: 'The page number to retrieve',
  })
  public getUsers() {
    return this.userService.findAll();
  }

  @Post()
  // @SetMetadata('authType', 'none') // Custom metadata to mark this route as public, which means no auth guard will be applied
  @Auth(AuthTypeEnum.NONE)
  public createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @UseGuards(AccessTokenGuard)
  @Post('/create-many')
  public createManyUsers(@Body() createManyUsersDto: CreateManyUsersDto) {
    return this.userService.createManyUsers(createManyUsersDto);
  }

  @Patch()
  public patchUser(@Body() patchUserDto: PatchUserDto) {
    console.log('Body:', patchUserDto);
    return 'This action updates a user';
  }
}
