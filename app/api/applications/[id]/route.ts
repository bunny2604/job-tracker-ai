import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

type JwtPayload = {
  userId: string;
};

// ✅ UPDATE
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const token = (await cookies()).get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'No token' }, { status: 401 });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as JwtPayload;

    const body = await req.json();

    const updated = await prisma.application.updateMany({
  where: {
    id: params.id,
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

// ✅ DELETE
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const token = (await cookies()).get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'No token' }, { status: 401 });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as JwtPayload;

    await prisma.application.delete({
      where: {
        id: params.id,
        userId: decoded.userId, // 🔐 prevents deleting others' data
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('DELETE ERROR:', err);
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}