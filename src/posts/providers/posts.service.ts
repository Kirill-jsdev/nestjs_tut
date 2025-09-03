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

  public async findAll() {
    const posts = await this.postsRepository.find();

    return posts;
  }

  public async delete(postId: number) {
    //find post
    const post = await this.postsRepository.findOneBy({ id: postId });
    //if post exists - delete it
    if (post) {
      await this.postsRepository.delete(postId);
    }
    //delete meta options
    if (post?.metaOptions) {
      await this.metaOptionsRepository.delete(post.metaOptions.id);
    }

    //send confirmation

    return { deleted: true, postId };
  }
}
