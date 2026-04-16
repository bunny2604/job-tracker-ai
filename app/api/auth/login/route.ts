import { prisma } from '@/lib/db';
import bcrypt from 'bcrypt';
import { signToken } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const user = await prisma.user.findUnique({
      where: { email: body.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 400 });
    }

    const isValid = await bcrypt.compare(body.password, user.password);

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 400 });
    }

    const token = signToken({ userId: user.id });

    return NextResponse.json({ token });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}