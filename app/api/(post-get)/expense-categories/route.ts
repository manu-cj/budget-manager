import { NextResponse } from 'next/server';
import ExpenseCategory from './../../../models/ExpenseCategory';

export async function GET() {
  try {
    // Liste des catégories de dépenses par défaut
    const defaultCategories = [
      'Logement', 'Nourriture', 'Transport', 'Santé', 'Loisirs',
      'Abonnements', 'Assurances', 'Éducation', 'Remboursements', 
      'Épargne', 'Animaux', 'Cadeaux et Événements', 'Divers', 'Vacances'
    ];

    // Récupérer toutes les catégories de dépenses depuis la collection MongoDB
    let expenseCategories = await ExpenseCategory.find();

    // Si aucune catégorie n'existe, créer les catégories par défaut
    if (expenseCategories.length === 0) {
      expenseCategories = await ExpenseCategory.insertMany(
        defaultCategories.map(name => ({ name }))
      );
    }

    // Retourner les catégories sous forme de réponse JSON
    return NextResponse.json(expenseCategories);
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories de dépenses :', error);
    return new NextResponse(JSON.stringify({ error: "Erreur interne du serveur" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
