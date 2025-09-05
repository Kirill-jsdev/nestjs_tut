import { Injectable } from '@nestjs/common';
import { PaginationQueryDto } from '../dtos/pagination-query.dto';
import { ObjectLiteral, Repository } from 'typeorm';

@Injectable()
export class PaginationProvider {
  public async paginateQuery<T extends ObjectLiteral>(
    paginateQuery: PaginationQueryDto,
    repository: Repository<T>,
  ) {
    const paginatedResults = await repository.find({
      skip: ((paginateQuery?.page || 1) - 1) * (paginateQuery?.limit || 10),
      take: paginateQuery.limit || 10,
    });

    return paginatedResults;
  } //repository of the entity that we want to query with pagination
}
