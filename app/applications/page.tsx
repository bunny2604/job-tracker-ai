import { headers } from 'next/headers';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/db';
import ApplicationsClient from '../components/ApplicationClient/ApplicationClient';

type JwtPayload = {
  userId: string;
};

export default async function Page() {
  // ✅ CORRECT: NO await here
  const headersList = headers();

  const cookieHeader = (await headersList).get('cookie') || '';

  const token = cookieHeader
    .split(';')
    .find((c) => c.trim().startsWith('token='))
    ?.split('=')[1];

  if (!token) {
    return <div>Unauthorized</div>;
  }

  let userId: string;

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as JwtPayload;

    userId = decoded.userId;
  } catch {
    return <div>Invalid session</div>;
  }

  const apps = await prisma.application.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <ApplicationsClient
      initialApps={apps.map((app) => ({
        ...app,
        createdAt: app.createdAt.toISOString(),
      }))}
    />
  );
}