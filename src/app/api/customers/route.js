import { connectToDatabase } from "../../../lib/db";
import { calculateLoyaltyPoints } from "../../../lib/loyaltyLogic";

export async function GET(request) {
  const url = new URL(request.url);
  const field = url.searchParams.get('field');
  const q = url.searchParams.get('q');
  const phone = url.searchParams.get('phone');
  const email = url.searchParams.get('email');
  const page = parseInt(url.searchParams.get('page') || '1', 10);
  const pageSize = parseInt(url.searchParams.get('pageSize') || '10', 10);
  const { db } = await connectToDatabase();

  let query = {};
  if (field && q) {
    // Partial match using regex, case-insensitive
    query[field] = { $regex: q, $options: 'i' };
  }
  if (phone) query.phone = phone;
  if (email) query.email = email;

  let customers, totalCount;
  if (phone || email) {
    customers = await db.collection("customers").findOne(query);
    customers = customers ? [customers] : [];
    totalCount = customers.length;
  } else {
    totalCount = await db.collection("customers").countDocuments(query);
    customers = await db.collection("customers")
      .find(query)
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .toArray();
  }
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  return new Response(JSON.stringify({ customers, totalPages }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function POST(request) {
  const { name, phone, email, purchaseAmount } = await request.json();
  if (!name || !phone || !purchaseAmount) {
    return new Response("Name, phone, and purchase amount are required", { status: 400 });
  }
  const { db } = await connectToDatabase();
  // Check if customer already exists
  const existing = await db.collection("customers").findOne({ phone });
  if (existing) {
    return new Response("Customer already exists", { status: 409 });
  }
  // Calculate loyalty points
  const loyaltyPoints = calculateLoyaltyPoints(Number(purchaseAmount));
  const newCustomer = {
    name,
    phone,
    email,
    loyaltyPoints,
    purchaseHistory: [
      {
        amount: Number(purchaseAmount),
        date: new Date(),
      },
    ],
    createdAt: new Date(),
  };
  const result = await db.collection("customers").insertOne(newCustomer);
  return new Response(JSON.stringify({ ...newCustomer, _id: result.insertedId }), {
    status: 201,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function PUT(request) {
  const { customerId, name, email, phone } = await request.json();
  if (!customerId) {
    return new Response('Customer ID is required', { status: 400 });
  }
  const { db } = await connectToDatabase();
  const { ObjectId } = await import('mongodb');
  const update = {};
  if (name) update.name = name;
  if (email) update.email = email;
  if (phone) update.phone = phone;
  const result = await db.collection('customers').findOneAndUpdate(
    { _id: new ObjectId(customerId) },
    { $set: update },
    { returnDocument: 'after' }
  );
  if (result.value) {
    return new Response(JSON.stringify({ message: 'Customer updated', customer: result.value }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } else {
    return new Response('Customer not found', { status: 404 });
  }
}

export async function PATCH(request) {
  const { customerId, amount, note, addNote, redeemAmount } = await request.json();
  if (!customerId) {
    return new Response("Customer ID is required", { status: 400 });
  }
  const { db } = await connectToDatabase();
  const { ObjectId } = await import('mongodb');
  const customer = await db.collection("customers").findOne({ _id: new ObjectId(customerId) });
  if (!customer) {
    return new Response("Customer not found", { status: 404 });
  }
  if (addNote && note) {
    // Add note to customer
    await db.collection("customers").findOneAndUpdate(
      { _id: customer._id },
      { $set: { notes: note } },
      { returnDocument: 'after' }
    );
    return new Response(JSON.stringify({ message: 'Note added' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  if (!amount || isNaN(amount) || Number(amount) <= 0) {
    return new Response("Valid amount is required", { status: 400 });
  }
  // Calculate points for this purchase
  const points = calculateLoyaltyPoints(Number(amount));
  // Handle redeeming credits
  let creditsToRedeem = 0;
  if (redeemAmount && !isNaN(redeemAmount) && Number(redeemAmount) > 0) {
    creditsToRedeem = Number(redeemAmount);
    if ((customer.loyaltyPoints ?? 0) < creditsToRedeem) {
      return new Response("Not enough credits to redeem", { status: 400 });
    }
  }
  // Add purchase to history
  const purchase = {
    amount: Number(amount),
    date: new Date(),
    ...(note ? { note } : {}),
    ...(points ? { pointsEarned: points } : {}),
    ...(creditsToRedeem > 0 ? { creditsRedeemed: creditsToRedeem } : {}),
  };
  // Build update object
  const updateObj = {
    $push: { purchaseHistory: purchase },
    $inc: { loyaltyPoints: points - creditsToRedeem },
  };
  const updateResult = await db.collection("customers").findOneAndUpdate(
    { _id: customer._id },
    updateObj,
    { returnDocument: 'after' }
  );
  return new Response(JSON.stringify({ message: 'Purchase added', customer: updateResult.value }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function DELETE(request) {
  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  if (!id) {
    return new Response('Customer ID is required', { status: 400 });
  }
  const { db } = await connectToDatabase();
  const { ObjectId } = await import('mongodb');
  const result = await db.collection('customers').deleteOne({ _id: new ObjectId(id) });
  if (result.deletedCount === 1) {
    return new Response(JSON.stringify({ message: 'Customer deleted' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } else {
    return new Response('Customer not found', { status: 404 });
  }
}