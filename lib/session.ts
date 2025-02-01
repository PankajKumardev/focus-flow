import { getServerSession } from 'next-auth';
import { NEXT_AUTH } from '@/lib/auth';

export async function getCurrentUser() {
  const session = await getServerSession(NEXT_AUTH);
  return session?.user;
}
