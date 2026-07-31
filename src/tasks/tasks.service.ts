import { Injectable, NotFoundException } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { DbService } from '../db/db.service';
import { tasks } from '../db/schema';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private readonly dbService: DbService) {}

  async create(userId: string, createTaskDto: CreateTaskDto) {
    const { title, description, status, priority, dueDate } = createTaskDto;

    const [newTask] = await this.dbService.db
      .insert(tasks)
      .values({
        userId,
        title,
        description,
        status,
        priority,
        dueDate: dueDate ? new Date(dueDate) : undefined,
      })
      .returning();

    return newTask;
  }

  async findAll(userId: string) {
    return this.dbService.db.query.tasks.findMany({
      where: { userId },
    });
  }

  async findOne(id: string, userId: string) {
    const task = await this.dbService.db.query.tasks.findFirst({
      where: { id, userId },
    });

    if (!task) {
      throw new NotFoundException(`La tarea con id ${id} no existe`);
    }

    return task;
  }

  async update(id: string, userId: string, updateTaskDto: UpdateTaskDto) {
    await this.findOne(id, userId);

    const { title, description, status, priority, dueDate } = updateTaskDto;

    const [updatedTask] = await this.dbService.db
      .update(tasks)
      .set({
        title,
        description,
        status,
        priority,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        updatedAt: new Date(),
      })
      .where(and(eq(tasks.id, id), eq(tasks.userId, userId)))
      .returning();

    return updatedTask;
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);

    await this.dbService.db
      .delete(tasks)
      .where(and(eq(tasks.id, id), eq(tasks.userId, userId)));
    return { message: 'Tarea eliminada correctamente' };
  }
}
