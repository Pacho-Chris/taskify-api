import {
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

// Definición de Enums para estados y prioridades
export const taskStatusEnum = pgEnum('task_status', [
  'PENDING',
  'IN_PROGRESS',
  'COMPLETED',
]);
export const taskPriorityEnum = pgEnum('task_priority', [
  'LOW',
  'MEDIUM',
  'HIGH',
]);

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  name: varchar('name', { length: 100 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const tasks = pgTable('tasks', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 155 }).notNull(),
  description: text('description'),
  status: taskStatusEnum('status').default('PENDING').notNull(),
  priority: taskPriorityEnum('priority').default('MEDIUM').notNull(),
  dueDate: timestamp('due_date'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
