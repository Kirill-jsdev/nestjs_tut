import { Injectable } from '@nestjs/common';

@Injectable()
export class PostsService {
  public findAll(userId: number) {
    return [
      {
        title: 'Post 1',
        content: 'Content of Post 1',
      },

      {
        title: 'Post 2',
        content: 'Content of Post 2',
      },
    ];
  }
}
