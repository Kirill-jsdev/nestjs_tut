import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { CreatePostDto } from '../dtos/create-post.dto';
import { UsersService } from 'src/users/providers/users.service';
import { TagsService } from 'src/tags/providers/tags.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../post.entity';
import { IActiveUser } from 'src/auth/interfaces/active-user.interface';

@Injectable()
export class CreatePostProvider {
  constructor(
    private readonly usersService: UsersService,
    private readonly tagsService: TagsService,

    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
  ) {}
  /** Create a new post */
  public async create(createPostDto: CreatePostDto, user: IActiveUser) {
    let author;
    let tags;
    try {
      //find author from db
      author = await this.usersService.findOneById(user.sub); //sub - is a user id in db
      //find tags from db
      tags = createPostDto.tags ? await this.tagsService.findMultipleTags(createPostDto.tags) : [];
    } catch (error) {
      throw new ConflictException(error);
    }

    if (createPostDto.tags?.length !== tags.length) {
      throw new BadRequestException('One or more tags do not exist');
    }

    const post = this.postsRepository.create({
      ...createPostDto,
      author: author,
      tags: tags,
    });

    try {
      await this.postsRepository.save(post);
    } catch (error) {
      throw new ConflictException(error, { description: 'Ensure post slug is unique' });
    }
  }
}
