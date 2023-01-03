import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from 'src/user/dto';
import { UserService } from './../../user.service';

describe('UserService Int', () => {
  let prisma: PrismaService;
  let userService: UserService;

  let createUserDto: CreateUserDto = {
    email: 'john2@skynet.com',
    firstName: 'John',
    lastName: 'Connor',
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    prisma = moduleRef.get<PrismaService>(PrismaService);
    userService = moduleRef.get<UserService>(UserService);
    await prisma.cleanDatabase();
  });

  describe('createUser()', () => {
    it('should create a user', async () => {
      const user = await userService.createUser(createUserDto);
      expect(user.email).toBe(createUserDto.email);
      expect(user.firstName).toBe(createUserDto.firstName);
      expect(user.lastName).toBe(createUserDto.lastName);
    });

    it('should throw on duplicate user email', async () => {
      await userService
        .createUser(createUserDto)
        .then((user) => expect(user).toBeUndefined())
        .catch((err) => expect(err.status).toBe(403));
    });
  });
});
