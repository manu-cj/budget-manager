"use client";
import { useEffect, useState } from "react";
import api from '@/app/lib/api';
import { Expense } from "@/app/types/expense";

import AddExpenseModal from "../forms/AddExpense";
import TotalExpenses from "../ui/card/BudgetCard";

const MonthlyExpenseSummary: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [monthlyTotal, setMonthlyTotal] = useState<number>(0);
  const [showAddExpense, setShowAddExpense] = useState<boolean>(false); // État pour afficher/cacher UpdateBudget

  useEffect(() => {
    /**
     * Fetches the expenses from the API and calculates the total expenses for the current month.
     *
     * This function performs the following steps:
     * 1. Sends a GET request to the `/api/expenses` endpoint to retrieve the expenses.
     * 2. If the response status is 200, it filters the expenses to include only those from the current month and year.
     * 3. Calculates the total amount of the filtered expenses and updates the state with this total.
     * 4. Handles different response statuses (e.g., 401) by setting an appropriate error message.
     * 5. Catches any errors that occur during the request and sets an error message.
     * 6. Ensures that the loading state is set to false once the request is complete.
     *
     * @async
     * @function fetchExpenses
     * @returns {Promise<void>} A promise that resolves when the expenses have been fetched and processed.
     */
    const fetchExpenses = async () => {
      try {
        const response = await api.get("/api/expenses");

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
          onButton={() => setShowAddExpense(true)}
          title={"Total des dépenses du mois"}
          type={"expense"}
          isButton={true}
        />
      )}

      {/* Modale d'ajout */}
      {showAddExpense && (
        <AddExpenseModal onClose={() => setShowAddExpense(false)} />
      )}
    </div>
  );
};

export default MonthlyExpenseSummary;
