import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

// ✅ CREATE
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const token = req.headers.get('authorization')?.split(' ')[1];

    if (!token) {
      return NextResponse.json({ error: 'No token' }, { status: 401 });
    }

    const decoded: any = verifyToken(token);

    const app = await prisma.application.create({
      data: {
        company: body.company,
        role: body.role,
        status: body.status,
        userId: decoded.userId,
      },
    });

    return NextResponse.json(app);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

// ✅ READ
export async function GET(req: Request) {
  try {
    const token = req.headers.get('authorization')?.split(' ')[1];

    if (!token) {
      return NextResponse.json({ error: 'No token' }, { status: 401 });
    }

    const decoded: any = verifyToken(token);

    const apps = await prisma.application.findMany({
      where: { userId: decoded.userId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(apps);
  } catch (err) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}