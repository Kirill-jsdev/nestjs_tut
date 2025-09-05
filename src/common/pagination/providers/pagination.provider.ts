import { Inject, Injectable } from '@nestjs/common';
import { PaginationQueryDto } from '../dtos/pagination-query.dto';
import { ObjectLiteral, Repository } from 'typeorm';
import type { Request } from 'express';
import { REQUEST } from '@nestjs/core';
import { IPaginated } from '../interfaces/paginated.interface';

@Injectable()
export class PaginationProvider {
  constructor(
    @Inject(REQUEST)
    private readonly request: Request,
  ) {}

  public async paginateQuery<T extends ObjectLiteral>(
    paginateQuery: PaginationQueryDto,
    repository: Repository<T>,
  ): Promise<IPaginated<T>> {
    const paginatedResults = await repository.find({
      skip: ((paginateQuery?.page || 1) - 1) * (paginateQuery?.limit || 10),
      take: paginateQuery.limit || 10,
    });

    //create request urls
    const baseUrl =
      this.request.protocol + '://' + this.request.headers.host + '/';
    const newURL = new URL(this.request.url, baseUrl);

    const totalItems = await repository.count();
    const totalPages = Math.ceil(totalItems / (paginateQuery.limit || 10));
    const currentPage = paginateQuery.page || 1;
    const nextPage = currentPage === totalPages ? currentPage : currentPage + 1;
    const prevPage = currentPage === 1 ? 1 : currentPage - 1;

    const finalResponse: IPaginated<T> = {
      data: paginatedResults,
      meta: {
        totalItems: totalItems,
        itemsPerPage: paginateQuery.limit || 10,
        totalPages: totalPages,
        currentPage: currentPage,
      },
      links: {
        first: `${newURL.origin}${newURL.pathname}?limit=${
          paginateQuery.limit || 10
        }&page=1`,
        previous: `${newURL.origin}${newURL.pathname}?limit=${
          paginateQuery.limit || 10
        }&page=${prevPage}`,
        next: `${newURL.origin}${newURL.pathname}?limit=${
          paginateQuery.limit || 10
        }&page=${nextPage}`,
        last: `${newURL.origin}${newURL.pathname}?limit=${
          paginateQuery.limit || 10
        }&page=${totalPages}`,
        current: `${newURL.origin}${newURL.pathname}?limit=${
          paginateQuery.limit || 10
        }&page=${currentPage}`,
      },
    };

    return finalResponse;
  } //repository of the entity that we want to query with pagination
}
