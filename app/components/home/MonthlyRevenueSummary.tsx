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
                <p>Chargement...</p>
            ) : error ? (
                <p className="text-red-800">{error}</p>
            ) : (
                <div className="w-full max-w-md p-6 bg-white rounded-2xl shadow-md border border-gray-200 flex flex-col items-center space-y-4">
                    <div className="flex items-center space-x-2">
                        <FaWallet className="text-gray-500 text-2xl" />
                        <h2 className="text-l font-semibold text-gray-700">
                            Total des revenues du mois
                        </h2>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">
                        {monthlyTotal} €
                    </p>
                    <button
                        onClick={() => setShowAddRevenue(true)}
                        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                    >
                        Ajouter un revenue
                    </button>
                </div>
            )}
            {showAddRevenue && (
                <AddRevenue onClose={()=> setShowAddRevenue(false)}/>
            )}
        </div>
    );
};

export default MonthlyRevenueSummary;
