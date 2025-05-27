import { NextResponse } from 'next/server';
import Admin from '@/models/Admin';
import { db } from '../../../models/Admin';

export async function GET(req) {
  try {
    await db.connect();
    const settings = await Admin.findOne({}); // Fetch admin settings
    await db.disconnect();
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.error();
  }
}

export async function POST(req) {
  const data = await req.json();
  
  try {
    await db.connect();
    const admin = new Admin(data);
    await admin.save(); // Save new admin settings
    await db.disconnect();
    return NextResponse.json(admin, { status: 201 });
  } catch (error) {
    return NextResponse.error();
  }
}