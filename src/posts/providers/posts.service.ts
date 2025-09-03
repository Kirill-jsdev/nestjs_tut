import { Body, Injectable } from '@nestjs/common';
import { UsersService } from '../../users/providers/users.service';
import { CreatePostDto } from '../dtos/create-post.dto';
import { Post } from '../post.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { MetaOption } from 'src/meta-options/meta-option.entity';

@Injectable()
export class PostsService {
  constructor(
    private readonly usersService: UsersService,
    /** Inject posts repository */
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,

    /** Inject meta options repository */
    @InjectRepository(MetaOption)
    private readonly metaOptionsRepository: Repository<MetaOption>,
  ) {}

  /** Create a new post */
  public async create(@Body() createPostDto: CreatePostDto) {
    const post = this.postsRepository.create(createPostDto);

    return this.postsRepository.save(post);
  }

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
