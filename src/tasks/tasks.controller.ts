import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksService } from './tasks.service';

interface RequestWithUser extends Request {
  user: {
    userId: string;
    email: string;
  };
}

@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Req() req: RequestWithUser, @Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(req.user.userId, createTaskDto);
  }

  @Get()
  findAll(@Req() req: RequestWithUser) {
    return this.tasksService.findAll(req.user.userId);
  }

  @Get(':id')
  findOne(@Req() req: RequestWithUser, @Param('id', ParseUUIDPipe) id: string) {
    return this.tasksService.findOne(id, req.user.userId);
  }

  @Patch(':id')
  update(
    @Req() req: RequestWithUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.tasksService.update(id, req.user.userId, updateTaskDto);
  }

  @Delete(':id')
  remove(@Req() req: RequestWithUser, @Param('id', ParseUUIDPipe) id: string) {
    return this.tasksService.remove(id, req.user.userId);
  }
}
