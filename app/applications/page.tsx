import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import ApplicationsClient from '../components/Applications/ApplicationsClient';

type JwtPayload = {
  userId: string;
};

export default async function Page() {
  const cookieStore = await cookies();

  const token = cookieStore.get('token')?.value;

  if (!token) {
    redirect('/login');
  }

  let userId: string | null = null;

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as JwtPayload;

    userId = decoded.userId;
  } catch {
    redirect('/login');
  }

  const apps = await prisma.application.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });

  return <ApplicationsClient initialApps={apps} />;
}