import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { GetUsersParamDto } from '../dtos/get-users-param.dto';
import { AuthService } from 'src/auth/providers/auth.service';
import { User } from '../user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import { ConfigService } from '@nestjs/config';

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

    private readonly configService: ConfigService,
  ) {}

  public async createUser(createUserDto: CreateUserDto): Promise<User> {
    //check is the user with the same email exists
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    //Handle exception
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    //Create a new user
    let user = this.userRepository.create(createUserDto);
    user = await this.userRepository.save(user);
    return user;
  }

  /**
   * Finds all users with optional filtering, pagination, and authentication check.
   * @param getUsersParamDto DTO containing filter parameters for users.
   * @param limit Maximum number of users to return.
   * @param page Page number for pagination.
   * @returns Array of user objects.
   */
  public findAll(
    getUsersParamDto: GetUsersParamDto,
    limit: number,
    page: number,
  ) {
    const env = this.configService.get<string>('S3_BUCKET');
    console.log('Environment:', env);

    const isAuth = this.authService.isAuthenticated();
    console.log('IsAuthenticated:', isAuth);
    console.log('GetUsersParamDto:', getUsersParamDto);
    console.log('Limit:', limit);
    console.log('Page:', page);
    return [
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'aA1!11111',
      },
      {
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane.doe@example.com',
        password: 'aA1!11112',
      },
    ];
  }

  /**
   * Finds a user by their unique ID.
   * @param id Unique identifier of the user.
   * @returns User object if found.
   */
  public async findOneById(userId: number) {
    const user = await this.userRepository.findOneBy({ id: userId });
    return user;
  }
}
