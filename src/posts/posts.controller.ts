import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { PostsService } from './providers/posts.service';
import { ApiTags } from '@nestjs/swagger/dist/decorators/api-use-tags.decorator';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get('{/:userId}')
  public getPosts(@Param('userId', ParseIntPipe) userId: number) {
    return this.postsService.findAll(userId);
  }
}
