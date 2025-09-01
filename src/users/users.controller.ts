import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Get('/:id')
  public getUsers(
    @Param('id', ParseIntPipe) id: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ) {
    console.log('Limit:', limit);
    console.log('Page:', page);
    return 'This action returns all users with id ' + id + ` ${limit} ${page}`;
  }

  @Post()
  public createUser(@Body() body: any) {
    console.log('Body:', body);
    return 'This action adds a new user';
  }
}
