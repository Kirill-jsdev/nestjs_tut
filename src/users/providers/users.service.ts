import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { GetUsersParamDto } from '../dtos/get-users-param.dto';
import { AuthService } from 'src/auth/providers/auth.service';

/**
 * Service for handling user-related business logic and data access.
 *
 * @author Batman
 * @description Connects to Users table and performs business logic on users.
 */
@Injectable()
export class UsersService {
  /**
   * Creates an instance of UsersService.
   * @param authService AuthService instance for authentication logic.
   */
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

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
  public findOneById(id: number) {
    console.log('FindOneById:', id);
    return {
      id: 1234,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'aA1!11111',
    };
  }
}
