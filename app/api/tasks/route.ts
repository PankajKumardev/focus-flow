import { db } from '@/db/drizzle';
import { tasks } from '@/db/schema';
import { NextResponse } from 'next/server';

import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/session';

const TaskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  dueDate: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high']),
  projectId: z.number().optional(),
});

export async function GET() {
  const user = await getCurrentUser();

  if (user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = Number(user.id);
  const userTasks = await db.select().from(tasks).where(eq(tasks.id, userId));

  return NextResponse.json(userTasks);
}

export async function POST(req: Request) {
  const user = await getCurrentUser();

  if (user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();

    const validatedTask = TaskSchema.parse(body);

    const newTask = await db
      .insert(tasks)
      .values({
        ...validatedTask,
        projectId: validatedTask.projectId ?? 0,
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

export async function PUT(req: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();

    const validatedTask = TaskSchema.parse(body);

    const updatedTask = await db
      .update(tasks)
      .set(validatedTask)
      .where(eq(tasks.id, Number(user.id)))
      .returning();

    return NextResponse.json(updatedTask);
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

export async function DELETE(req: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();

    const taskId = Number(body.id);

    await db.delete(tasks).where(eq(tasks.id, taskId));

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
