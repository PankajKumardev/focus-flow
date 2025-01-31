import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { db } from '@/db/drizzle';
import { z } from 'zod';
import { compare, hash } from 'bcryptjs';
import { users } from '@/db/schema';

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const NEXT_AUTH = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text', placeholder: 'email' },
        password: {
          label: 'Password',
          type: 'password',
          placeholder: 'password',
        },
      },
      async authorize(credentials) {
        const parsedCredentials = credentialsSchema.safeParse(credentials);
        if (!parsedCredentials.success) {
          throw new Error('Invalid credentials');
        }

        const { email, password } = parsedCredentials.data;

        // Check if user exists
        let user = await db.query.users.findFirst({
          where: (users, { eq }) => eq(users.email, email),
        });

        if (!user) {
          const hashedPassword = await hash(password, 10);
          const insertedUsers = await db
            .insert(users)
            .values({
              email,
              password: hashedPassword,
            })
            .returning();
          user = insertedUsers[0];
        } else {
          if (!user.password) {
            throw new Error('Invalid password');
          }
          const isValidPassword = await compare(password, user.password);
          if (!isValidPassword) {
            throw new Error('Invalid password');
          }
        }

        return {
          id: user.id.toString(),
          email: user.email,
        };
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_ID || '',
      clientSecret: process.env.GOOGLE_SECRET || '',
      async profile(profile) {
        const email = profile.email;
        let user = await db.query.users.findFirst({
          where: (users, { eq }) => eq(users.email, email),
        });

        if (!user) {
          const insertedUsers = await db
            .insert(users)
            .values({
              email,
              password: '',
            })
            .returning();
          user = insertedUsers[0];
        }

        return {
          id: user.id.toString(),
          email: user.email,
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    jwt: ({ token, user }: any) => {
      if (user) {
        token.userid = user.id;
      }
      return token;
    },
    session: ({ token, session }: any) => {
      if (session && session.user) {
        session.user.id = token.userid;
      }
      return session;
    },
  },
  // pages: {
  //   signIn: '/signin',
  // },
};
