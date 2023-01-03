import { ForbiddenException, Injectable } from '@nestjs/common';
import { Todo } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTodoDto } from './dto';

@Injectable()
export class TodoService {
  constructor(private readonly prisma: PrismaService) {}

  async createTodo(
    userId: number,
    createTodoDto: CreateTodoDto,
  ): Promise<Todo> {
    return this.prisma.todo
      .create({
        data: {
          userId,
          ...createTodoDto,
        },
      })
      .catch((err) => {
        if (err instanceof PrismaClientKnownRequestError) {
          if (err.code === 'P2002') {
            throw new ForbiddenException('Duplicate todo title');
          }
        }
        throw err;
      });
  }
  updateTodo() {}
}
