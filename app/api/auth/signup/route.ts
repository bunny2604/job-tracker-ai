import { prisma } from '@/lib/db';
import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const hashedPassword = await bcrypt.hash(body.password, 10);

    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: hashedPassword,
      },
    });

    return NextResponse.json(user);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Signup failed' }, { status: 500 });
  }
}