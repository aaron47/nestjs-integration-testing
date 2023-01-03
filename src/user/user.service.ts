import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    return this.prisma.user
      .create({
        data: {
          ...createUserDto,
        },
      })
      .catch((err) => {
        if (err instanceof PrismaClientKnownRequestError) {
          if (err.code === 'P2002') {
            throw new ForbiddenException('Duplicate user email');
          }
        }
        throw err;
      });
  }
}
