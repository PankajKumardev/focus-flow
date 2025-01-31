import { db } from '@/db/drizzle';
import { projects } from '@/db/schema';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { NEXT_AUTH } from '@/lib/auth';
import { z } from 'zod';
import { eq } from 'drizzle-orm';

const ProjectSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
});

// Fetch projects for the logged-in user
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
