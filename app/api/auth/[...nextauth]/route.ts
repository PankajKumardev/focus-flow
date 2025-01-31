import NextAuth, { Session } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { db } from '@/db/drizzle';
import { eq } from 'drizzle-orm';
import { users } from '@/db/schema';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Email format is not correct'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      createdAt: Date;
    };
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          const parsed = loginSchema.safeParse(credentials);
          if (!parsed.success) {
            throw new Error(parsed.error.errors[0].message);
          }

          const [user] = await db
            .select()
            .from(users)
            .where(eq(users.email, parsed.data.email));

          if (
            !user ||
            !(await bcrypt.compare(parsed.data.password, user.password))
          ) {
            throw new Error('Invalid credentials');
          }

          return {
            id: user.id.toString(),
            email: user.email,
            createdAt: user.createdAt,
          };
        } catch (error) {
          console.error('Authentication error:', error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.sub) {
        const [user] = await db
          .select({
            id: users.id,
            email: users.email,
            createdAt: users.createdAt,
          })
          .from(users)
          .where(eq(users.id, Number(token.sub)));

        if (user) {
          session.user = {
            id: user.id.toString(),
            email: user.email,
            createdAt: user.createdAt,
          };
        }
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
});
