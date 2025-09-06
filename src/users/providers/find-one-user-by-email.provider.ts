import {
  Injectable,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class FindOneUserByEmailProvider {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  public async findOneUserByEmail(email: string) {
    let user: User | null = null;

    try {
      user = await this.usersRepository.findOne({ where: { email } });
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'Error connecting to the database',
      });
    }

    if (!user) {
      throw new UnauthorizedException('Invalid credentials', {
        description: 'User with this email does not exist',
      });
    }

    return user;
  }
}
