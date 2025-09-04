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
    //find author from db
    const author = await this.usersService.findOneById(createPostDto.authorId);

    const post = author
      ? this.postsRepository.create({
          ...createPostDto,
          author: author,
        })
      : null;

    return post ? this.postsRepository.save(post) : null;
  }

  public async findAll() {
    const posts = await this.postsRepository.find();

    return posts;
  }

  public async delete(postId: number) {
    await this.postsRepository.delete(postId);

    return { deleted: true, postId };
  }
}
