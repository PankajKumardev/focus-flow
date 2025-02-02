'use server';
import { db } from '@/db/drizzle';
import { projects } from '@/db/schema';
import { getCurrentUser } from '@/lib/session';
import { and, asc, eq } from 'drizzle-orm';

interface NewProject {
  name: string;
  createdAt: Date;
}

export const createProject = async (project: NewProject) => {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Unauthorized');
  }

  await db.insert(projects).values({
    ...project,
    userId: user.id,
  });
};

export const getProjects = async () => {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Unauthorized');
  }
  const data = await db
    .select()
    .from(projects)
    .where(eq(projects.userId, user.id))
    .orderBy(asc(projects.id));
};

export const deleteProject = async (projectId: number) => {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Unauthorized');
  }
  await db
    .delete(projects)
    .where(and(eq(projects.userId, user.id), eq(projects.id, projectId)));
};

export const updateProject = async (projectId: number, name: string) => {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Unauthorized');
  }
  await db
    .update(projects)
    .set({
      name,
    })
    .where(and(eq(projects.userId, user.id), eq(projects.id, projectId)));
};
