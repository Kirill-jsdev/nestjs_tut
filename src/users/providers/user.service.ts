import { Injectable } from '@nestjs/common';
import { GetUsersParamDto } from '../dtos/get-users-param.dto';

@Injectable()
export class UsersService {
  public findAll(
    getUsersParamDto: GetUsersParamDto,
    limit: number,
    page: number,
  ) {
    console.log('GetUsersParamDto:', getUsersParamDto);
    console.log('Limit:', limit);
    console.log('Page:', page);
    return [
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'aA1!11111',
      },
      {
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane.doe@example.com',
        password: 'aA1!11112',
      },
    ];
  }

  public findOneById(id: number) {
    console.log('FindOneById:', id);
    return {
      id: 1234,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'aA1!11111',
    };
  }
}
