import {
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
  integer,
} from 'drizzle-orm/pg-core';

export const users = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name'),
  email: text('email').unique(),
  password: text('password'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  name: varchar('name'),
  description: varchar('description'),
});

export const tasks = pgTable('tasks', {
  id: serial('id').primaryKey(),
  title: varchar('title'),
  description: varchar('description'),
  priority: integer('priority'),
  dueDate: timestamp('due_date'),
  projectId: integer('project_id').references(() => projects.id),
  userId: integer('user_id').references(() => users.id),
});
