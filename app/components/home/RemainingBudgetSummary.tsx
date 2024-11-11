"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaMoneyBillAlt } from "react-icons/fa"; // Vous pouvez choisir une autre icône si vous préférez
import { Expense } from "@/app/types/expense";
import { Budget } from "@/app/types/budget";

const RemainingBudgetSummary: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [monthlyTotal, setMonthlyTotal] = useState<number>(0);
  const [totalBudget, setTotalBudget] = useState<number>(0); // Stocke le total du budget

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await axios.get("/api/expenses");

        if (response.status === 200) {
          const fetchedExpenses: Expense[] = response.data.expense;

          console.log(fetchedExpenses);

          const currentMonth = new Date().getMonth();
          const currentYear = new Date().getFullYear();
          const total = fetchedExpenses
            .filter((expense) => {
              const expenseDate = new Date(expense.date);
              return (
                expenseDate.getMonth() === currentMonth &&
                expenseDate.getFullYear() === currentYear
              );
            })
            .reduce((sum, expense) => sum + expense.amount, 0);

          setMonthlyTotal(total);
          console.log(monthlyTotal);
        } else if (response.status === 401) {
          setError(response.data.error);
        } else {
          setError(response.data.error || "Erreur inconnue");
        }
      } catch (error) {
        setError(`Erreur lors de la requête, ${error}`);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, [monthlyTotal]);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await axios.get("/api/budget");

        if (response.status === 200) {
          console.log(response.data);

          // On suppose que la réponse contient une propriété 'budget' de type Budget
          const fetchedBudget = response.data.budget as Budget;

          // Stocke l'objet complet du budget dans 'budgetTotal'

          // Calcul du total du budget, en ignorant 'updated_at'
          const total = Object.entries(fetchedBudget)
            .filter(([key]) => key !== "updated_at") // Ignore la clé 'updated_at'
            .reduce((acc, [, value]) => acc + value, 0);
          console.log(monthlyTotal);

          setTotalBudget(total); // Met à jour le total dans 'totalBudget'
          console.log(total); // Affiche le total
        } else if (response.status === 401) {
          setError(response.data.error);
        } else {
          setError(response.data.error || "Erreur inconnue");
        }
      } catch (error) {
        setError(`Erreur lors de la requête, ${error}`);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  const remainingBudget = totalBudget - monthlyTotal;
  const percentage = (remainingBudget / totalBudget) * 100;

  // Définition des couleurs en fonction de la progression
  const getColor = () => {
    if (percentage > 50) return "#38A169"; // > 50% : vert (hex couleur Tailwind)
    if (percentage > 20) return "#D69E2E"; // 20%-50% : jaune
    return "#E53E3E"; // < 20% : rouge
  };
  return (
    <div>
      {loading ? (
        <p>Chargement...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div className="w-full max-w-md p-6 bg-white rounded-2xl shadow-md border border-gray-200 flex flex-col items-center space-y-4">
      <div className="flex items-center space-x-2">
        <FaMoneyBillAlt className="text-gray-500 text-2xl" />
        <h2 className="text-xl font-semibold text-gray-700">
          Budget restant du mois
        </h2>
      </div>

      {/* Affichage du montant restant */}
      <p className="text-3xl font-bold text-gray-800">
        {remainingBudget} €
      </p>

      {/* Jauge circulaire avec animation */}
      <div className="relative flex justify-center items-center">
        <svg
          className="w-24 h-24"
          viewBox="0 0 36 36"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            className="text-gray-300"
            cx="18"
            cy="18"
            r="15.9155"
            strokeWidth="2"
            fill="none"
          />
          <circle
            style={{
              stroke: getColor(), // Applique la couleur en fonction du pourcentage
              strokeDasharray: `${percentage} 100`, // Applique le pourcentage de la jauge
            }}
            cx="18"
            cy="18"
            r="15.9155"
            strokeWidth="2"
            strokeLinecap="round"
            transform="rotate(-90 18 18)"
            fill="none"
          />
        </svg>
        <span className="absolute text-xl font-semibold text-gray-800">
          {Math.round(percentage)}%
        </span>
      </div>
    </div>
      )}
    </div>
  );
};

export default RemainingBudgetSummary;
