import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/db';

export async function POST(req) {
  const { username, password } = await req.json();
  if (!username || !password) {
    return NextResponse.json({ error: 'Username and password required' }, { status: 400 });
  }
  const { db } = await connectToDatabase();
  const admin = await db.collection('admins').findOne({ username });
  if (!admin) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }
  const valid = await bcrypt.compare(password, admin.passwordHash);
  if (!valid) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }
  // Set a simple cookie for session (for demo, use JWT in production)
  const res = NextResponse.json({ message: 'Login successful' });
  res.cookies.set('admin_auth', 'true', { httpOnly: true, path: '/', sameSite: 'lax' });
  return res;
}

export async function DELETE() {
  // Logout
  const res = NextResponse.json({ message: 'Logged out' });
  res.cookies.set('admin_auth', '', { httpOnly: true, path: '/', expires: new Date(0) });
  return res;
}