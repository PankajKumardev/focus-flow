import { db } from '@/db/drizzle';
import { tasks } from '@/db/schema';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/session';

const TaskSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  dueDate: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high']),
  projectId: z.number().optional(),
});

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = Number(user.id);
  // Fetch tasks based on projects the user owns (if related to `projectId`)
  const userTasks = await db
    .select()
    .from(tasks)
    .where(eq(tasks.projectId, userId)); // assuming tasks.projectId is related to user's projects

  return NextResponse.json(userTasks);
}

export async function POST(req: Request) {
  const user = await getCurrentUser();

  if (!user) {
    // Fix this check
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

    if (!validatedTask.id) {
      return NextResponse.json(
        { error: 'Task id is required' },
        { status: 400 }
      );
    }

    const updatedTask = await db
      .update(tasks)
      .set({
        title: validatedTask.title,
        descrption: validatedTask.description,
        dueDate: validatedTask.dueDate,
        priority: validatedTask.priority,
        projectId: validatedTask.projectId,
      })
      .where(eq(tasks.id, validatedTask.id))
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

    if (!taskId) {
      return NextResponse.json(
        { error: 'Task id is required' },
        { status: 400 }
      );
    }

    await db.delete(tasks).where(eq(tasks.id, taskId));

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
