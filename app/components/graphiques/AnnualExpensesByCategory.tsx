import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { useEffect, useState } from "react";
import api from './../../lib/api';
interface Expense {
  category_id: string;
  amount: number;
  date: string;
}

interface Category {
  _id: string;
  name: string;
}

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#AF19FF",
  "#FF1919",
  "#19FFB1",
  "#FF19E7",
  "#19FF19",
  "#1919FF",
  "#FF19A6",
  "#FF1919",
]  

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
          expensesByCategory[category._id] = 0;
        });

        const currentDate = new Date();
        const lastYearDate = new Date();
        lastYearDate.setFullYear(currentDate.getFullYear() - 1);

        

        fetchedExpenses.forEach((expense) => {
          const expenseDate = new Date(expense.date);
          if (expenseDate >= lastYearDate ) {
           
            console.log(expense.amount);
            
            expensesByCategory[expense.category_id] += expense.amount;
          }
        });

        setCategories(fetchedCategories);
        setExpensesByCategory(expensesByCategory);
        console.log(expensesByCategory);
        
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
    value: expensesByCategory[category._id] || 0
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
        <div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar 
              dataKey="value" 
              barSize={50} // Augmente la taille de la barre
            >
              {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-4">
          <ul className="flex flex-col">
            {categories.map((category, index) => (
              <li key={category._id} className="flex items-center w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 mb-2 px-2">
            <span 
              className="inline-block w-3 h-3 mr-2 rounded-full" 
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            ></span>
            <span className="text-sm sm:text-base md:text-lg font-medium">{category.name} : {expensesByCategory[category._id] || 0} €</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      )}
    </div>
  );
};

export default AnnualExpensesByCategory;
