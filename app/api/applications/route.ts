import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

type JwtPayload = {
  userId: string;
};

export async function POST(req: Request) {
  try {
    const cookieStore = cookies();
    const token = (await cookieStore).get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'No token' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    const body = await req.json();

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
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function GET() {
  try {
    const cookieStore = cookies();
    const token = (await cookieStore).get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'No token' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    const apps = await prisma.application.findMany({
      where: { userId: decoded.userId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(apps);
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}