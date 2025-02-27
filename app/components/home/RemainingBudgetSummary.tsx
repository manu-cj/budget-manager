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
  const [totalBudget, setTotalBudget] = useState<number>(0);
  const [showUpdateBudget, setShowUpdateBudget] = useState<boolean>(false);
  const [circlePercentage, setCirclePercentage] = useState<number>(100);
  const [displayPercentage, setDisplayPercentage] = useState<number>(100); // Nouveau state

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
            .filter(([key]) => key !== "updated_at")
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

  const getColor = () => {
    if (percentage > 50) return "#38A169";
    if (percentage > 20) return "#D69E2E";
    return "#E53E3E";
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (circlePercentage > percentage) {
        setCirclePercentage((prev) => Math.max(prev - 0.8, percentage));
      }

      if (displayPercentage > percentage) {
        setDisplayPercentage((prev) => Math.max(prev - 0.8, percentage));
      }
    }, 30); // 70ms pour ralentir l'animation

    return () => clearInterval(interval);
  }, [percentage, circlePercentage, displayPercentage]);

  return (
    <div>
      {loading ? (
        <p className="text-text-muted text-center">Chargement...</p>
      ) : error ? (
        <p className="text-danger text-center">{error}</p>
      ) : (
        <div className="w-full max-w-md p-0 bg-secondary rounded-2xl shadow-lg border border-secondary-dark flex flex-col items-center space-y-6 pb-6 pr-6 pl-6">
                    {/* Titre et icône */}
                    <div className="w-72 p-4 rounded-2xl flex flex-col space-y-2 relative">
                        <div className="absolute -top-6 -left-10 bg-accent p-5 rounded-full border-8 border-background">
                        <FaMoneyBillAlt className="text-white text-xl" />
                        </div>
                      
                    </div>
          <h2 className="text-lg font-bold text-primary">
              Budget restant du mois
            </h2>
          {/* Montant restant */}
          <p className="text-3xl font-extrabold text-primary">{remainingBudget.toFixed(2)} €</p>
  
          {/* Cercle de pourcentage */}
          <div className="relative flex justify-center items-center">
            <svg
              className="w-32 h-32"
              viewBox="0 0 36 36"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Cercle de fond */}
              <circle
                className="text-secondary-dark"
                cx="18"
                cy="18"
                r="15.9155"
                strokeWidth="3"
                fill="none"
              />
              {/* Cercle progressif */}
              <circle
                style={{
                  stroke: getColor(),
                  strokeDasharray: `${circlePercentage} 100`,
                }}
                cx="18"
                cy="18"
                r="15.9155"
                strokeWidth="3"
                strokeLinecap="round"
                transform="rotate(-90 18 18)"
                fill="none"
              />
            </svg>
            <span className="absolute text-2xl font-semibold text-primary">
              {Math.round(displayPercentage)}%
            </span>
          </div>
  
          {/* Bouton d'action */}
          <button
            onClick={() => setShowUpdateBudget(true)}
            className="bg-accent text-text-light py-3 px-6 rounded-lg hover:bg-accent-dark focus:outline-none focus:ring-2 focus:ring-accent-dark focus:ring-offset-2"
          >
            Mettre à jour le budget
          </button>
        </div>
      )}
  
      {/* Modale de mise à jour */}
      {showUpdateBudget && (
        <UpdateBudget onClose={() => setShowUpdateBudget(false)} />
      )}
    </div>
  );
  
  
};

export default RemainingBudgetSummary;
