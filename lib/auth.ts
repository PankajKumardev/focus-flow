import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { db } from '../db/drizzle';
import { users } from '../db/schema';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          const parsedCredentials = credentialsSchema.parse(credentials);

          const user = await db.query.users.findFirst({
            where: (users, { eq }) => eq(users.email, parsedCredentials.email),
          });

          if (!user) {
            await db.insert(users).values({
              email: parsedCredentials.email,
              password: bcrypt.hashSync(parsedCredentials.password, 10),
            });
          }
          if (
            !user ||
            !bcrypt.compareSync(parsedCredentials.password, user.password!)
          )
            return null;
          return {
            id: user.id.toString(),
            email: user.email,
            password: user.password,
            createdAt: user.createdAt,
          };
        } catch (error) {
          console.error('Error during authorization:', error);
          return null;
        }
      },
    }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.user = user;
      return token;
    },
    async session({ session, token }) {
      session.user = token.user as any;
      return session;
    },
  },
});
