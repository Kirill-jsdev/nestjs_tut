import { Body, Injectable } from '@nestjs/common';
import { UsersService } from '../../users/providers/users.service';
import { CreatePostDto } from '../dtos/create-post.dto';
import { Post } from '../post.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { MetaOption } from 'src/meta-options/meta-option.entity';
import { TagsService } from 'src/tags/providers/tags.service';
import { PatchPostDto } from '../dtos/patch-post.dto';

@Injectable()
export class PostsService {
  constructor(
    private readonly usersService: UsersService,
    private readonly tagsService: TagsService,
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

  public async findAll() {
    const posts = await this.postsRepository.find({
      relations: {
        // author: true,
        // tags: true,
      },
    });

    return posts;
  }

  public async delete(postId: number) {
    await this.postsRepository.delete(postId);

    return { deleted: true, postId };
  }

  public async update(postId: number, patchPostDto: PatchPostDto) {
    //Find the tags
    const tags = patchPostDto.tags
      ? await this.tagsService.findMultipleTags(patchPostDto.tags)
      : [];
    //Find the post
    const post = await this.postsRepository.findOneBy({
      id: postId,
    });

    //Update the properties of the post
    //Assign the new tags
    const updatedPost = { ...post, ...patchPostDto, tags };
    //Save the post and return it
    return await this.postsRepository.save(updatedPost);
  }
}
