import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { DbService } from '../db/db.service';
import { users } from '../db/schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly dbService: DbService) {}

  async create(createUserDto: CreateUserDto) {
    const { name, email, password } = createUserDto;
    const existing = await this.dbService.db.query.users.findFirst({
      where: { email },
    });

    if (existing) {
      throw new ConflictException('El email ya está registrado');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [newUser] = await this.dbService.db
      .insert(users)
      .values({ email, name, password: hashedPassword })
      .returning();

    return this.sanitizeUser(newUser);
  }

  async findAll() {
    const result = await this.dbService.db.query.users.findMany();
    return result.map((user) => this.sanitizeUser(user));
  }

  async findByEmail(email: string) {
    return this.dbService.db.query.users.findFirst({
      where: { email },
    });
  }

  async findOne(id: string) {
    const user = await this.dbService.db.query.users.findFirst({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`El usuario con id ${id} no existe`);
    }

    return this.sanitizeUser(user);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.findOne(id);

    const dataToUpdate: Partial<typeof users.$inferInsert> = {
      ...updateUserDto,
    };

    if (updateUserDto.password) {
      dataToUpdate.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    if (updateUserDto.email) {
      const existing = await this.findByEmail(updateUserDto.email);
      if (existing) throw new ConflictException('El email ya está registrado');
    }

    const [updatedUser] = await this.dbService.db
      .update(users)
      .set(dataToUpdate)
      .where(eq(users.id, id))
      .returning();

    return this.sanitizeUser(updatedUser);
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.dbService.db.delete(users).where(eq(users.id, id));
    return { message: 'Usuario eliminado correctamente' };
  }

  private sanitizeUser(user: typeof users.$inferSelect) {
    const { id, email, name, createdAt } = user;
    return { id, email, name, createdAt };
  }
}
