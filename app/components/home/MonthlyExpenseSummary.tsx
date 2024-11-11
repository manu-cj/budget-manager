"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Expense } from "@/app/types/expense";
import { FaWallet } from "react-icons/fa";

const MonthlyExpenseSummary: React.FC = () => {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [monthlyTotal, setMonthlyTotal] = useState<number>(0);

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
                <p>Chargement...</p>
            ) : error ? (
                <p>{error}</p>
            ) : (
                <div className="w-full max-w-md p-6 bg-white rounded-2xl shadow-md border border-gray-200 flex flex-col items-center space-y-4">
                    <div className="flex items-center space-x-2">
                        <FaWallet className="text-gray-500 text-2xl" />
                        <h2 className="text-xl font-semibold text-gray-700">
                            Total des dépenses du mois
                        </h2>
                    </div>
                    <p className="text-3xl font-bold text-gray-800">
                        {monthlyTotal} €
                    </p>
                </div>
            )}
        </div>
    );
};

export default MonthlyExpenseSummary;
