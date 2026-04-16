import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

type JwtPayload = {
  userId: string;
};

// ✅ UPDATE APPLICATION
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const token = req.headers.get('authorization')?.split(' ')[1];

    if (!token) {
      return NextResponse.json({ error: 'No token' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    const body = await req.json();

    const updated = await prisma.application.updateMany({
      where: {
        id,
        userId: decoded.userId,
      },
      data: {
        status: body.status,
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error('UPDATE ERROR:', err);
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}

// ✅ DELETE APPLICATION
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const token = req.headers.get('authorization')?.split(' ')[1];

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