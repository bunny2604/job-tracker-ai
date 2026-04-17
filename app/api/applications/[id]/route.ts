import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

type JwtPayload = {
  userId: string;
};

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;

    const cookieStore = cookies();
const token = (await cookieStore).get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'No token' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    const body = await req.json();

    await prisma.application.updateMany({
      where: { id, userId: decoded.userId },
      data: { status: body.status },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const cookieStore = cookies();
const token = (await cookieStore).get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'No token' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    await prisma.application.deleteMany({
      where: {
        id,
        userId: decoded.userId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('DELETE ERROR:', err);
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}