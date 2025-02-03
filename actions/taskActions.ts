'use server';

import { db } from '@/db/drizzle';
import { tasks } from '@/db/schema';
import { getCurrentUser } from '@/lib/session';
import { and, asc, eq, inArray, not } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

interface NewTask {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  projectId: number;
  category: 'work' | 'personal' | 'hobby';
}
export const createTask = async (task: NewTask) => {
  const user = await getCurrentUser();
  if (!user) throw new Error('Unauthorized');

  await db.insert(tasks).values({
    ...task,
    dueDate: task.dueDate,
    userId: user.id,
  });
  revalidatePath('/dashboard');
};

export const getTasks = async () => {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Unauthorized');
  }
  const data = await db
    .select()
    .from(tasks)
    .where(eq(tasks.userId, user.id))
    .orderBy(asc(tasks.id));
  return data;
};

export const toggleTask = async (taskId: number) => {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('User not authenticated');
  }
  await db
    .update(tasks)
    .set({
      completed: not(tasks.completed),
    })
    .where(and(eq(tasks.userId, user.id), eq(tasks.id, taskId)));

  revalidatePath('/');
};

interface EditTask extends Partial<NewTask> {
  id: number;
}

export const editTask = async (task: EditTask) => {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Unauthorized');
  }

  await db
    .update(tasks)
    .set({
      ...task,
      updatedAt: new Date(),
    })
    .where(and(eq(tasks.userId, user.id), eq(tasks.id, task.id)));

  revalidatePath('/');
};

export const deleteTask = async (taskIds: number | number[]) => {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  const ids = Array.isArray(taskIds) ? taskIds : [taskIds];

  await db
    .delete(tasks)
    .where(and(eq(tasks.userId, user.id), inArray(tasks.id, ids)));
  revalidatePath('/');
};
