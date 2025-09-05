import {
  Injectable,
  forwardRef,
  Inject,
  RequestTimeoutException,
  BadRequestException,
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
  ) {}

  public async createUser(createUserDto: CreateUserDto): Promise<User> {
    //check is the user with the same email exists

    let existingUser;

    try {
      existingUser = await this.userRepository.findOne({
        where: { email: createUserDto.email },
      });
    } catch (error) {
      //here we might want to log the error somewhere, for example to an external logging service
      //any sensitive info should not be logged, AND MUST NOT BE SENT TO THE CLIENT
      console.error('Database error:', error);
      throw new RequestTimeoutException('Database request timed out', {
        description: 'Error connecting to the database',
      });
    }

    //Handle exception
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    //Create a new user
    let user = this.userRepository.create(createUserDto);

    try {
      user = await this.userRepository.save(user);
    } catch (error) {
      console.error('Database error:', error);
      throw new RequestTimeoutException('Database request timed out', {
        description: 'Error connecting to the database',
      });
    }
    return user;
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

  //this method will create multiple users in a transaction. WE IMPLEMENT A TRANSACTION
  public async createManyUsers(createManyUsersDto: CreateManyUsersDto) {
    return this.usersCreateManyProvider.createManyUsers(createManyUsersDto);
  }
}
