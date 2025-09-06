import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { User } from '../user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HashingProvider } from 'src/auth/providers/hashing.provider';

@Injectable()
export class CreateUserProvider {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @Inject(forwardRef(() => HashingProvider))
    private readonly hashingProvider: HashingProvider,
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
    let user = this.userRepository.create({
      ...createUserDto,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      password: await this.hashingProvider.hashPassword(createUserDto.password),
    });

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
}
