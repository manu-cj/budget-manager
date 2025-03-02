import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";
import api from '@/app/lib/api';

interface Expense {
  category_id: string;
  amount: number;
  date: string;
}

interface Category {
  id: string;
  name: string;
}


const AnnualExpensesByCategory: React.FC = () => {
  const [expensesByCategory, setExpensesByCategory] = useState<{ [key: string]: number }>({});
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [expensesResponse, categoriesResponse] = await Promise.all([
          api.get("/api/expenses"),
          api.get("/api/expense-categories")
        ]);

        const fetchedExpenses: Expense[] = expensesResponse.data.expense;
        const fetchedCategories: Category[] = categoriesResponse.data;

        const expensesByCategory: { [key: string]: number } = {};

        fetchedCategories.forEach((category) => {
          expensesByCategory[category.id] = 0;
        });

        const currentDate = new Date();
        const lastYearDate = new Date();
        lastYearDate.setFullYear(currentDate.getFullYear() - 1);

        fetchedExpenses.forEach((expense) => {
          const expenseDate = new Date(expense.date);
          if (expenseDate >= lastYearDate && expenseDate <= currentDate) {
            expensesByCategory[expense.category_id] += expense.amount;
          }
        });

        setCategories(fetchedCategories);
        setExpensesByCategory(expensesByCategory);
      } catch  {
        setError("Erreur lors de la récupération des données");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const chartData = categories.map((category) => ({
    name: category.name,
    value: expensesByCategory[category.id] || 0
  }));

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
      {/* Titre et icône */}

        <h2 className="text-lg font-bold text-primary">Dépenses par Catégorie (Annuel)</h2>

      
      {loading ? (
        <p className="text-text-muted text-center">Chargement...</p>
      ) : error ? (
        <p className="text-danger text-center">{error}</p>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar 
              dataKey="value" 
              fill="#f87171"
              barSize={50} // Augmente la taille de la barre
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default AnnualExpensesByCategory;
