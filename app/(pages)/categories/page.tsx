'use client';

import React, { useEffect, useState } from 'react';

interface Category {
  id: number;
  name: string;
}

const CategoryDisplay: React.FC = () => {
  const [expenseCategories, setExpenseCategories] = useState<Category[]>([]);
  const [revenueCategories, setRevenueCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const expenseResponse = await fetch('/api/expense-categories');
        const revenueResponse = await fetch('/api/revenue-categories');

        if (!expenseResponse.ok || !revenueResponse.ok) {
          throw new Error('Erreur lors de la récupération des catégories');
        }

        const expenseData = await expenseResponse.json();
        const revenueData = await revenueResponse.json();

        setExpenseCategories(expenseData);
        setRevenueCategories(revenueData);
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Catégories de Dépenses</h2>
      <ul>
        {expenseCategories.map(category => (
          <li key={category.id}>{category.name}</li>
        ))}
      </ul>

      <h2>Catégories de Revenus</h2>
      <ul>
        {revenueCategories.map(category => (
          <li key={category.id}>{category.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryDisplay;
