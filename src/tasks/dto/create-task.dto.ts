import {
  IsEnum,
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { taskPriorityEnum, taskStatusEnum } from '../../db/schema';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty({ message: 'El título de la tarea es obligatorio' })
  @MaxLength(155, { message: 'El título no puede superar los 155 caracteres' })
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(taskStatusEnum.enumValues, { message: 'Estado de tarea no válido' })
  status?: (typeof taskStatusEnum.enumValues)[number];

  @IsOptional()
  @IsEnum(taskPriorityEnum.enumValues, { message: 'Prioridad no válida' })
  priority?: (typeof taskPriorityEnum.enumValues)[number];

  @IsOptional()
  @IsISO8601({}, { message: 'La fecha de vencimiento no es válida' })
  dueDate?: string;
}
