import { Injectable } from '@nestjs/common';
import { CreateTagDto } from '../dtos/create-tag.dto';
import { In, Repository } from 'typeorm';
import { Tag } from '../tag.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagsRepository: Repository<Tag>,
  ) {}

  public async create(createTagDto: CreateTagDto) {
    const tag = this.tagsRepository.create(createTagDto);
    return await this.tagsRepository.save(tag);
  }

  public async findMultipleTags(tagIds: number[]) {
    return await this.tagsRepository.find({
      where: { id: In(tagIds) },
    });
  }

  public async delete(tagId: number) {
    await this.tagsRepository.delete(tagId);

    return { deleted: true, tagId };
  }

  public async softDelete(tagId: number) {
    await this.tagsRepository.softDelete(tagId);
    return { deleted: true, tagId };
  }
}
