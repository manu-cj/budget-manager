import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/app/lib/DbConnect';
import RevenueCategory from './../../../models/RevenueCategory';

export async function GET() {
  try {
    await connectToDatabase();
    const defaultCategories = [
      'Salaire', 'Freelance', 'Investissements', 'Ventes', 'Autres'
  ];
    const revenueCategories = await RevenueCategory.find({});

    if (revenueCategories.length === 0) {
      await RevenueCategory.insertMany(
        defaultCategories.map(name => ({ name }))
      );
    }
    return NextResponse.json(revenueCategories);
  } catch {
    return NextResponse.json({ error: 'Erreur lors de la récupération des catégories de revenus' }, { status: 500 });
  }
}