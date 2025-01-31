import { db } from '@/db/drizzle';
import { projects } from '@/db/schema';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { NEXT_AUTH } from '@/lib/auth';
import { z } from 'zod';
import { eq } from 'drizzle-orm';

const ProjectSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, 'Project name is required'),
});

export async function GET() {
  const session = await getServerSession(NEXT_AUTH);

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = Number(session.user.id);
  const userProjects = await db
    .select()
    .from(projects)
    .where(eq(projects.userId, userId));

  return NextResponse.json(userProjects);
}

export async function POST(req: Request) {
  const session = await getServerSession(NEXT_AUTH);

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();

    const validatedProject = ProjectSchema.parse(body);

    const newProject = await db
      .insert(projects)
      .values({
        ...validatedProject,
        userId: Number(session.user.id),
      })
      .returning();

    return NextResponse.json(newProject);
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
  const session = await getServerSession(NEXT_AUTH);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const body = await req.json();
    const validatedProject = ProjectSchema.parse(body);
    const updatedProject = await db
      .update(projects)
      .set(validatedProject)
      .where(eq(projects.id, validatedProject.id!))
      .returning();
    return NextResponse.json(updatedProject);
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
  const session = await getServerSession(NEXT_AUTH);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    const deletedProject = await db
      .delete(projects)
      .where(eq(projects.id, Number(id)))
      .returning();
    return NextResponse.json(deletedProject);
  } catch (error) {
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
