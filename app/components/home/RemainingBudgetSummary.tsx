"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaMoneyBillAlt } from "react-icons/fa";
import { Expense } from "@/app/types/expense";
import { Budget } from "@/app/types/budget";
import UpdateBudget from "../forms/UpdateBudget";

const RemainingBudgetSummary: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [monthlyTotal, setMonthlyTotal] = useState<number>(0);
  const [totalBudget, setTotalBudget] = useState<number>(0); // Stocke le total du budget
  const [showUpdateBudget, setShowUpdateBudget] = useState<boolean>(false); // État pour afficher/cacher UpdateBudget

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await axios.get("/api/expenses");

        if (response.status === 200) {
          const fetchedExpenses: Expense[] = response.data.expense;

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
    const fetchBudget = async () => {
      try {
        const response = await axios.get("/api/budget");

        if (response.status === 200) {
          const fetchedBudget = response.data.budget as Budget;

          const total = Object.entries(fetchedBudget)
            .filter(([key]) => key !== "updated_at") // Ignore la clé 'updated_at'
            .reduce((acc, [, value]) => acc + value, 0);

          setTotalBudget(total);
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

    fetchBudget();
  }, [monthlyTotal]);

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
        <p className="text-red-800">{error}</p>
      ) : (
        <div className="w-full max-w-md p-6 bg-white rounded-2xl shadow-md border border-gray-200 flex flex-col items-center space-y-4">
          <div className="flex items-center space-x-2">
            <FaMoneyBillAlt className="text-gray-500 text-2xl" />
            <h2 className="text-l font-semibold text-gray-700">
              Budget restant du mois
            </h2>
          </div>

          {/* Affichage du montant restant */}
          <p className="text-2xl font-bold text-gray-800">{remainingBudget} €</p>

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
                  stroke: getColor(),
                  strokeDasharray: `${percentage} 100`,
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

          {/* Bouton pour afficher la modal */}
          <button
            onClick={() => setShowUpdateBudget(true)}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
          >
            Mettre à jour le budget
          </button>
        </div>
      )}

      {/* Affichage conditionnel de la modal */}
      {showUpdateBudget && (
        <UpdateBudget onClose={() => setShowUpdateBudget(false)} />
      )}
    </div>
  );
};

export default RemainingBudgetSummary;
