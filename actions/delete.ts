'use server';

import { db } from '@/db/drizzle';
import { tasks, projects } from '@/db/schema';
import { getCurrentUser } from '@/lib/session';
import { revalidatePath } from 'next/cache';
import { and, eq } from 'drizzle-orm';

export const deleteTask = async (taskId: number) => {
  const user = await getCurrentUser();
  if (!user) throw new Error('Unauthorized');

  await db
    .delete(tasks)
    .where(and(eq(tasks.id, taskId), eq(tasks.userId, Number(user.id))));

  revalidatePath('/tasks');
};

export const deleteProject = async (projectId: number) => {
  const user = await getCurrentUser();
  if (!user) throw new Error('Unauthorized');

  await db
    .delete(projects)
    .where(
      and(eq(projects.id, projectId), eq(projects.userId, Number(user.id)))
    );

  revalidatePath('/projects');
};
