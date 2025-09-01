import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { GetUsersParamDto } from './dtos/get-users-param.dto';
import { PatchUserDto } from './dtos/patch-user.dto';
import { UserService } from './providers/user.service';

@Controller('users')
export class UsersController {
  constructor(
    // inject UserService
    private readonly userService: UserService,
  ) {}

  @Get('{/:id}')
  public getUsers(
    @Param() getUsersParamDto: GetUsersParamDto,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ) {
    return this.userService.findAll(getUsersParamDto, limit, page);
  }

  @Post()
  public createUser(@Body() createUserDto: CreateUserDto) {
    console.log('Body:', createUserDto);
    return 'This action adds a new user';
  }

  @Patch()
  public patchUser(@Body() patchUserDto: PatchUserDto) {
    console.log('Body:', patchUserDto);
    return 'This action updates a user';
  }
}
