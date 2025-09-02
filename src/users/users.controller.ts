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
import { UsersService } from './providers/user.service';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

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
