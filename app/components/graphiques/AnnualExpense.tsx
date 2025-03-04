"use client";
import { useEffect, useState } from "react";
import api from '@/app/lib/api';
import { Expense } from "@/app/types/expense";

import AddExpenseModal from "../forms/AddExpense";
import TotalExpenses from "../ui/card/BudgetCard";

const AnnualExpense: React.FC = () => {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [annualTotalExpense, setAnnualTotalExpense] = useState<number>(0);
    const [annualTotalRevenue, setAnnualTotalRevenue] = useState<number>(0);

    const [showAddExpense, setShowAddExpense] = useState<boolean>(false);

    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const response = await api.get("/api/expenses");

                if (response.status === 200) {
                    const fetchedExpenses: Expense[] = response.data.expense;

                    console.log(fetchedExpenses);

                    const twelveMonthsAgo = new Date();
                    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

                    const total = fetchedExpenses
                        .filter((expense) => {
                            const expenseDate = new Date(expense.date);
                            return expenseDate >= twelveMonthsAgo;
                        })
                        .reduce((sum, expense) => sum + expense.amount, 0);

                        setAnnualTotalExpense(total);
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

    useEffect(() => {
        const fetchRevenues = async () => {
          try {
            const response = await api.get("/api/revenues");
    
            if (response.status === 200) {
              const fetchedExpenses: Expense[] = response.data.expense;
    
              console.log(fetchedExpenses);
    
              const twelveMonthsAgo = new Date();
              twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
    
              const total = fetchedExpenses
                  .filter((expense) => {
                      const expenseDate = new Date(expense.date);
                      return expenseDate >= twelveMonthsAgo;
                  })
                  .reduce((sum, expense) => sum + expense.amount, 0);
    
                  setAnnualTotalRevenue(total);
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
    
        fetchRevenues();
      }, []);

    return (
        <div className="flex flex-col items-center justify-center py-2">
            {loading ? (
            <p className="text-text-muted text-center">Chargement...</p>
            ) : error ? (
            <p className="text-danger text-center">{error}</p>
            ) : (
                <div className="w-full flex flex-col items-center gap-8">
                    <TotalExpenses
                        monthlyTotal={annualTotalExpense}
                        onButton={() => setShowAddExpense(true)}
                        title={"Total des dépenses des 12 derniers mois"}
                        type={"expense"}
                        isButton={false}
                    />
                    <TotalExpenses
                        monthlyTotal={annualTotalRevenue}
                        onButton={() => setShowAddExpense(true)}
                        title={"Total des revenues de l'année"}
                        type={"revenue"}
                        isButton={false}
                    />
                    <TotalExpenses
                        monthlyTotal={annualTotalExpense / 12}
                        onButton={() => setShowAddExpense(true)}
                        title={"Moyenne des dépenses des 12 derniers mois"}
                        type={"expense"}
                        isButton={false}
                    />
                    <TotalExpenses
                        monthlyTotal={annualTotalRevenue / 12}
                        onButton={() => setShowAddExpense(true)}
                        title={"Moyenne des revenues de l'année des 12 derniers mois"}
                        type={"revenue"}
                        isButton={false}
                    />
                    <TotalExpenses
                        monthlyTotal={annualTotalRevenue - annualTotalExpense}
                        onButton={() => setShowAddExpense(true)}
                        title={annualTotalRevenue - annualTotalExpense > 0 ? "Bénéfice de l'année" : "Perte de l'année"}
                        type={annualTotalRevenue - annualTotalExpense > 0 ? "revenue" : "expense"}
                        isButton={false}
                    />
                </div>
            )}

            {showAddExpense && (
            <AddExpenseModal onClose={() => setShowAddExpense(false)} />
            )}
        </div>
    );
};

export default AnnualExpense;
