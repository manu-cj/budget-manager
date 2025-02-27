"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Expense } from "@/app/types/expense";
import { FaWallet } from "react-icons/fa";
import AddExpenseModal from "../forms/AddExpense";

const MonthlyExpenseSummary: React.FC = () => {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [monthlyTotal, setMonthlyTotal] = useState<number>(0);
    const [showAddExpense, setShowAddExpense] = useState<boolean>(false); // État pour afficher/cacher UpdateBudget

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
                        .filter(expense => {
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
      <div>
        {loading ? (
          <p className="text-text-muted text-center">Chargement...</p>
        ) : error ? (
          <p className="text-danger text-center">{error}</p>
        ) : (
          <div className="w-full max-w-md p-0 bg-secondary rounded-2xl shadow-lg border border-secondary-dark flex flex-col items-center space-y-6 pb-6 pr-6 pl-6">
            {/* Titre et icône */}
            <div className="w-72 p-4 rounded-2xl flex flex-col space-y-2 relative">
                <div className="absolute -top-6 -left-10 bg-red-400 p-5 rounded-full border-8 border-background">
                <FaWallet className="text-white text-xl" />
                </div>
              
            </div>
            <h2 className="text-lg font-bold text-primary">
                Total des dépenses du mois
              </h2>
            {/* Montant total */}
            <p className="text-3xl font-extrabold text-primary">
              {monthlyTotal.toFixed(2)} €
            </p>

            {/* Bouton d'ajout */}
            <button
              onClick={() => setShowAddExpense(true)}
              className="bg-red-400 text-text-light py-3 px-6 rounded-lg hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-accent-dark focus:ring-offset-2"
            >
              Ajouter une dépense
            </button>
          </div>
        )}

        {/* Modale d'ajout */}
        {showAddExpense && (
          <AddExpenseModal onClose={() => setShowAddExpense(false)} />
        )}
      </div>
    );
      
      
};

export default MonthlyExpenseSummary;
