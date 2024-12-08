"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Expense } from "@/app/types/expense";
import { FaWallet } from "react-icons/fa";
import AddRevenue from "../forms/AddRevenue";

const MonthlyRevenueSummary: React.FC = () => {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [monthlyTotal, setMonthlyTotal] = useState<number>(0);
    const [showAddRevenue, setShowAddRevenue] = useState<boolean>(false); // État pour afficher/cacher UpdateBudget

    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const response = await axios.get("/api/revenues");

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
            <div className="w-full max-w-md p-6 bg-secondary rounded-2xl shadow-lg border border-secondary-dark flex flex-col items-center space-y-6">
              {/* Titre et icône */}
              <div className="flex items-center space-x-2">
                <FaWallet className="text-accent-dark text-3xl" /> {/* Icône dorée */}
                <h2 className="text-lg font-bold text-primary">
                  Total des revenus du mois
                </h2>
              </div>
      
              {/* Montant total */}
              <p className="text-3xl font-extrabold text-primary">{monthlyTotal.toFixed(2)} €</p>
      
              {/* Bouton d'ajout */}
              <button
                onClick={() => setShowAddRevenue(true)}
                className="bg-accent text-text-light py-3 px-6 rounded-lg hover:bg-accent-dark focus:outline-none focus:ring-2 focus:ring-accent-dark focus:ring-offset-2"
              >
                Ajouter un revenu
              </button>
            </div>
          )}
      
          {/* Modale d'ajout */}
          {showAddRevenue && (
            <AddRevenue onClose={() => setShowAddRevenue(false)} />
          )}
        </div>
      );
      
      
};

export default MonthlyRevenueSummary;
