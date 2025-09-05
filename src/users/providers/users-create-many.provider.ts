import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { User } from '../user.entity';
import { CreateManyUsersDto } from '../dtos/create-many-users.dto';

@Injectable()
export class UsersCreateManyProvider {
  constructor(private readonly dataSource: DataSource) {}

  //this method will create multiple users in a transaction. WE IMPLEMENT A TRANSACTION
  public async createManyUsers(createManyUsersDto: CreateManyUsersDto) {
    const newUsers: User[] = [];
    //create a query runner
    const queryRunner = this.dataSource.createQueryRunner();

    //connect query runner instance to the database
    await queryRunner.connect();

    //start a transaction
    await queryRunner.startTransaction();

    try {
      for (const createUserDto of createManyUsersDto.users) {
        const user = queryRunner.manager.create(User, createUserDto);
        const result = await queryRunner.manager.save(user);
        newUsers.push(result);
      }
      //if successful, commit the transaction
      await queryRunner.commitTransaction();
    } catch (error) {
      console.error('Database error:', error);
      //if error, rollback the transaction
      await queryRunner.rollbackTransaction();
    } finally {
      //release connection
      await queryRunner.release();
    }
    //return created users
    return newUsers;
  }
}
