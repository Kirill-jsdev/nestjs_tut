import {
  BadRequestException,
  Body,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { UsersService } from '../../users/providers/users.service';
import { CreatePostDto } from '../dtos/create-post.dto';
import { Post } from '../post.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { MetaOption } from 'src/meta-options/meta-option.entity';
import { TagsService } from 'src/tags/providers/tags.service';
import { PatchPostDto } from '../dtos/patch-post.dto';
import { Tag } from 'src/tags/tag.entity';
import { GetPostsQueryDto } from '../dtos/get-posts.dto';
import { PaginationProvider } from 'src/common/pagination/providers/pagination.provider';

@Injectable()
export class PostsService {
  constructor(
    private readonly usersService: UsersService,
    private readonly tagsService: TagsService,
    private readonly paginationProvider: PaginationProvider,

    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,

    @InjectRepository(MetaOption)
    private readonly metaOptionsRepository: Repository<MetaOption>,
  ) {}

  /** Create a new post */
  public async create(@Body() createPostDto: CreatePostDto) {
    //find author from db
    const author = await this.usersService.findOneById(createPostDto.authorId);

    //find tags from db
    const tags = createPostDto.tags
      ? await this.tagsService.findMultipleTags(createPostDto.tags)
      : [];

    const post = author
      ? this.postsRepository.create({
          ...createPostDto,
          author: author,
          tags: tags,
        })
      : null;

    return post ? this.postsRepository.save(post) : null;
  }

  public async findAll(postQuery: GetPostsQueryDto) {
    const posts = await this.paginationProvider.paginateQuery<Post>(
      {
        limit: postQuery.limit,
        page: postQuery.page,
      },
      this.postsRepository,
    );

    return posts;
  }

  public async delete(postId: number) {
    await this.postsRepository.delete(postId);

    return { deleted: true, postId };
  }

  public async update(postId: number, patchPostDto: PatchPostDto) {
    let tags: Tag[] | undefined;
    let post: Post | null;

    try {
      tags = patchPostDto.tags
        ? await this.tagsService.findMultipleTags(patchPostDto.tags)
        : undefined;
    } catch (error) {
      console.error('Database error:', error);
      throw new RequestTimeoutException('Database request timed out', {
        description: 'Error connecting to the database',
      });
    }

    if (
      (patchPostDto.tags && tags === null) ||
      (tags && tags.length !== (patchPostDto.tags?.length ?? 0))
    ) {
      throw new BadRequestException('Please, check your tag ids', {
        description: 'Error connecting to the database',
      });
    }

    //Find the post
    try {
      post = await this.postsRepository.findOneBy({
        id: postId,
      });
    } catch (error) {
      console.error('Database error:', error);
      throw new RequestTimeoutException('Database request timed out', {
        description: 'Error connecting to the database',
      });
    }

    if (!post) {
      throw new BadRequestException('Post not found', {
        description: 'The post with the given id does not exist',
      });
    }

    //Update the properties of the post
    //Assign the new tags
    const updatedPost = { ...post, ...patchPostDto, tags };
    //Save the post and return it
    try {
      await this.postsRepository.save(updatedPost);
    } catch (error) {
      console.error('Database error:', error);
      throw new RequestTimeoutException('Database request timed out', {
        description: 'Error connecting to the database',
      });
    }
    return updatedPost;
  }
}
