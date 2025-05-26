import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { calculateLoyaltyPoints } from '@/lib/loyaltyLogic';
import Customer from '@/models/Customer';

export async function GET(req) {
  try {
    await db.connect();
    const customers = await Customer.find({});
    await db.disconnect();
    return NextResponse.json(customers);
  } catch (error) {
    return NextResponse.error();
  }
}

export async function POST(req) {
  const { customerId, purchaseAmount } = await req.json();

  try {
    await db.connect();
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return NextResponse.json({ message: 'Customer not found' }, { status: 404 });
    }

    const pointsEarned = calculateLoyaltyPoints(purchaseAmount);
    customer.loyaltyPoints += pointsEarned;
    await customer.save();
    await db.disconnect();

    return NextResponse.json({ message: 'Loyalty points updated', pointsEarned });
  } catch (error) {
    return NextResponse.error();
  }
}