import { Injectable } from '@nestjs/common';
import { UsersService } from '../../users/providers/user.service';

@Injectable()
export class PostsService {
  constructor(private readonly usersService: UsersService) {}

  public findAll(userId: number) {
    const user = this.usersService.findOneById(userId);

    console.log('User:', user);

    return [
      {
        user: user,
        title: 'Post 1',
        content: 'Content of Post 1',
      },

      {
        user: user,
        title: 'Post 2',
        content: 'Content of Post 2',
      },
    ];
  }
}
