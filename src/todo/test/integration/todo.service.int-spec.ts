import { TodoService } from './../../todo.service';
import { AppModule } from 'src/app.module';
import { Test } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTodoDto } from 'src/todo/dto';
import { TodoStatus } from '@prisma/client';

describe('TodoService Int', () => {
  let prisma: PrismaService;
  let todoService: TodoService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    prisma = moduleRef.get<PrismaService>(PrismaService);
    todoService = moduleRef.get<TodoService>(TodoService);
    await prisma.cleanDatabase();
  });

  describe('createTodo()', () => {
    let userId: number = 0;
    const createTodoDto: CreateTodoDto = {
      title: 'Kill Sarah Connor',
      description: 'I need to kill Sarah Connor',
    };

    it('should create user', async () => {
      const user = await prisma.user.create({
        data: {
          email: 'john@skynet.com',
          firstName: 'John',
          lastName: 'Connor',
        },
      });

      userId = user.id;
    });

    it('should create todo', async () => {
      const todo = await todoService.createTodo(userId, createTodoDto);
      expect(todo.title).toBe(createTodoDto.title);
      expect(todo.description).toBe(createTodoDto.description);
      expect(todo.status).toBe(TodoStatus.OPEN);
    });

    it('should throw on duplicate title', async () => {
      await todoService
        .createTodo(userId, createTodoDto)
        .then((todo) => expect(todo).toBeUndefined())
        .catch((err) => expect(err.status).toBe(403));
    });
  });

  describe('updateTodo()', () => {});

  it.todo('should pass');
});
