import {
  pgTable,
  serial,
  varchar,
  timestamp,
  boolean,
  date,
  integer,
  pgEnum,
} from "drizzle-orm/pg-core";

// User Table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  password: varchar("password", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
});

// Project Table
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Fixed categories
export const categories = [
  { id: 1, name: "Work" },
  { id: 2, name: "Personal" },
  { id: 3, name: "Urgent" },
];

export const priorityEnum = pgEnum("priority", ["low", "medium", "high"]);

// Task Table
export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: varchar("description"),
  priority: priorityEnum("priority").default("low"),
  dueDate: date("due_date"),
  completed: boolean("completed").default(false),
  projectId: integer("project_id").references(() => projects.id).notNull(),
  categoryId: integer("category_id").notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
