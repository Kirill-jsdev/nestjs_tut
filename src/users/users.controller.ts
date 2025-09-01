import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Get('/:id')
  public getUsers(@Param() params: any, @Query() query: any) {
    console.log('Query:', query);
    return 'This action returns all users with id ' + params.id;
  }

  @Post()
  public createUser(@Body() body: any) {
    console.log('Body:', body);
    return 'This action adds a new user';
  }
}
