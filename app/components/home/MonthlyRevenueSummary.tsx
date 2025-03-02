"use client";
import { useEffect, useState } from "react";
import api from '@/app/lib/api';
import { Expense } from "@/app/types/expense";
import TotalExpenses from "../ui/card/BudgetCard";
import AddRevenue from "../forms/AddRevenue";

const MonthlyRevenueSummary: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [monthlyTotal, setMonthlyTotal] = useState<number>(0);
  const [showAddRevenue, setShowAddRevenue] = useState<boolean>(false); // État pour afficher/cacher UpdateBudget

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await api.get("/api/revenues");

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

  return (
    <div className="flex flex-col items-center justify-center py-2">
      {loading ? (
        <p className="text-text-muted text-center">Chargement...</p>
      ) : error ? (
        <p className="text-danger text-center">{error}</p>
      ) : (
        <TotalExpenses
          monthlyTotal={monthlyTotal}
          onButton={() => setShowAddRevenue(true)}
          title={"Total des revenues du mois"}
          type={"revenue"}
          isButton={true}
        />
      )}

      {/* Modale d'ajout */}
      {showAddRevenue && (
        <AddRevenue onClose={() => setShowAddRevenue(false)} />
      )}
    </div>
  );
};

export default MonthlyRevenueSummary;
