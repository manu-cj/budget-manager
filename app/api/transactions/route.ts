import { NextRequest, NextResponse } from 'next/server';
import db from '@/app/lib/db';

interface Transaction {
  id: number;
  amount: number;
  description: string;
  date: string;
}

// GET : Récupère toutes les transactions
export async function GET() {
  const transactions = db.prepare('SELECT * FROM transactions').all() as Transaction[];
  return NextResponse.json(transactions);
}

// POST : Ajoute une nouvelle transaction
export async function POST(req: NextRequest) {
  const { amount, description, date } = await req.json();
  const statement = db.prepare(
    'INSERT INTO transactions (amount, description, date) VALUES (?, ?, ?)'
  );
  const result = statement.run(amount, description, date);
  return NextResponse.json({ id: result.lastInsertRowid });
}
