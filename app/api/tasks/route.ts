import { db } from '@/db/drizzle';
import { tasks } from '@/db/schema';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { NEXT_AUTH } from '@/lib/auth';
import { z } from 'zod';
import { eq } from 'drizzle-orm';

const TaskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  dueDate: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high']),
  projectId: z.number().optional(),
});

export async function GET() {
  const session = await getServerSession(NEXT_AUTH);

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = Number(session.user.id);
  const userTasks = await db.select().from(tasks).where(eq(tasks.id, userId));

  return NextResponse.json(userTasks);
}

export async function POST(req: Request) {
  const session = await getServerSession(NEXT_AUTH);

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();

    const validatedTask = TaskSchema.parse(body);

    const newTask = await db
      .insert(tasks)
      .values({
        ...validatedTask,
        categoryId: Number(session.user.id),
      })
      .returning();

    return NextResponse.json(newTask);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
