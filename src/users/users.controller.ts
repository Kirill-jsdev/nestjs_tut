import { Controller, Get, Post } from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Get()
  public getUsers() {
    return 'This action returns all users';
  }

  @Post()
  public createUser() {
    return 'This action adds a new user';
  }
}
