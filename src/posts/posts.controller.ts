import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { PostsService } from './providers/posts.service';
import { ApiTags } from '@nestjs/swagger/dist/decorators/api-use-tags.decorator';
import { CreatePostDto } from './dtos/create-post.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PatchPostDto } from './dtos/patch-post.dto';
import { GetPostsQueryDto } from './dtos/get-posts.dto';
import { ActiveUser } from 'src/auth/decorators/active-user.decorator';
import { type IActiveUser } from 'src/auth/interfaces/active-user.interface';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  public getPosts(@Query() postQuery: GetPostsQueryDto) {
    console.log(postQuery);
    return this.postsService.findAll(postQuery);
  }

  @ApiOperation({ summary: 'Creates a new post' })
  @ApiResponse({
    status: 201,
    description: 'The post has been successfully created.',
    type: CreatePostDto,
  })
  @Post()
  public createPost(@Body() createPostDto: CreatePostDto, @ActiveUser() user: IActiveUser) {
    return this.postsService.create(createPostDto, user);
  }

  @Patch('/:id')
  public updatePost(@Param('id', ParseIntPipe) id: number, @Body() patchPostsDto: PatchPostDto) {
    return this.postsService.update(id, patchPostsDto);
  }

  @Delete('/:id')
  public deletePost(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.delete(id);
  }
}
