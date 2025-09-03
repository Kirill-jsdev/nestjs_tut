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
    //1 create metaoptions that come as a part of the request
    //We need to create meta option first before we can create post, as post has a foreign key of meta options table
    const metaOptions = createPostDto.metaOptions
      ? this.metaOptionsRepository.create(createPostDto.metaOptions)
      : null;
    if (metaOptions) {
      await this.metaOptionsRepository.save(metaOptions);
    }
    //2 create post
    const post = this.postsRepository.create(createPostDto);
    //3 Add metaoptions to the post
    if (metaOptions) {
      post.metaOption = metaOptions;
    }
    //4 return the created post
    return await this.postsRepository.save(post);
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
