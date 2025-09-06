import {
  Injectable,
  forwardRef,
  Inject,
  RequestTimeoutException,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from 'src/auth/providers/auth.service';
import { User } from '../user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import profileConfig from '../config/profile.config';
import type { ConfigType } from '@nestjs/config';
import { UsersCreateManyProvider } from './users-create-many.provider';
import { CreateManyUsersDto } from '../dtos/create-many-users.dto';
import { CreateUserProvider } from './create-user.provider';
import { FindOneUserByEmailProvider } from './find-one-user-by-email.provider';

/**
 * Service for handling user-related business logic and data access.
 *
 * @author Batman
 * @description Connects to Users table and performs business logic on users.
 */
@Injectable()
export class UsersService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @Inject(profileConfig.KEY)
    private readonly profileConfiguration: ConfigType<typeof profileConfig>,

    private readonly usersCreateManyProvider: UsersCreateManyProvider,
    private readonly createUserProvider: CreateUserProvider,
    private readonly findOneUserByEmailProvider: FindOneUserByEmailProvider,
  ) {}

  public async createUser(createUserDto: CreateUserDto): Promise<User> {
    return await this.createUserProvider.createUser(createUserDto);
  }

  /**
   * Finds all users with optional filtering, pagination, and authentication check.
   * @param getUsersParamDto DTO containing filter parameters for users.
   * @param limit Maximum number of users to return.
   * @param page Page number for pagination.
   * @returns Array of user objects.
   */
  public findAll() {
    throw new HttpException(
      {
        status: HttpStatus.MOVED_PERMANENTLY,
        error: 'The API endpoint does not exist',
      },
      HttpStatus.MOVED_PERMANENTLY,
      {
        //this object is not sent to the client
        description:
          'The API endpoint does not exist just because it is not implemented',
        cause: new Error('Not implemented'),
      },
    );
  }

  /**
   * Finds a user by their unique ID.
   * @param id Unique identifier of the user.
   * @returns User object if found.
   */
  public async findOneById(userId: number): Promise<User> {
    let user: User | null;

    try {
      user = await this.userRepository.findOneBy({ id: userId });
      if (!user) {
        throw new NotFoundException('User not found');
      }
    } catch (error) {
      console.error('Database error:', error);
      throw new RequestTimeoutException('Database request timed out', {
        description: 'Error connecting to the database',
      });
    }

    return user;
  }

  /**
   * Finds a user by their email address.
   * @param email Email address of the user.
   * @returns User object if found, null if not found.
   */
  public async findOneByEmail(email: string): Promise<User | null> {
    let user: User | null;

    try {
      user = await this.userRepository.findOneBy({ email });
    } catch (error) {
      console.error('Database error:', error);
      throw new RequestTimeoutException('Database request timed out', {
        description: 'Error connecting to the database',
      });
    }

    return user;
  }

  //this method will create multiple users in a transaction. WE IMPLEMENT A TRANSACTION
  public async createManyUsers(createManyUsersDto: CreateManyUsersDto) {
    return await this.usersCreateManyProvider.createManyUsers(
      createManyUsersDto,
    );
  }

  public async findUserByEmail(email: string) {
    return await this.findOneUserByEmailProvider.findOneUserByEmail(email);
  }
}
