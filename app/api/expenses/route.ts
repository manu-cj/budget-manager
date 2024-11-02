import { NextResponse } from 'next/server';
import { Expense } from '@/app/types/expense';
import { createExpense } from '@/app/controllers/expenseController';

export async function POST(request: Request) {
  const expense: Expense = await request.json();
  await createExpense(expense);
  return NextResponse.json({ message: 'Dépense créée avec succès.' });
}
