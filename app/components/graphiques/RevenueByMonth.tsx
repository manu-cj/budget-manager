"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Expense } from "@/app/types/expense";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// Fonction pour obtenir les 12 derniers mois dans le bon ordre (du mois actuel au mois le plus ancien)
const getLast12Months = () => {
    const now = new Date();
    const months = [
        "Jan", "Fév", "Mar", "Avr", "Mai", "Juin",
        "Juil", "Août", "Sep", "Oct", "Nov", "Déc"
    ];
    const currentMonthIndex = now.getMonth();
    
    return [
        ...months.slice(currentMonthIndex + 1), // Les mois après le mois actuel
        ...months.slice(0, currentMonthIndex + 1) // Du début de l'année au mois actuel
    ];
};

const AnnualRevenueByMonth: React.FC = () => {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [monthlyRevenues, setMonthlyRevenues] = useState<number[]>(Array(12).fill(0));

    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const response = await axios.get("/api/revenues");

                if (response.status === 200) {
                    const fetchedExpenses: Expense[] = response.data.expense;

                    const twelveMonthsAgo = new Date();
                    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11); // 11 mois en arrière pour inclure le mois actuel

                    const monthlyTotals = Array(12).fill(0);

                    fetchedExpenses.forEach((expense) => {
                        const expenseDate = new Date(expense.date);
                        if (expenseDate >= twelveMonthsAgo) {
                            const monthDiff = (new Date().getFullYear() - expenseDate.getFullYear()) * 12 + (new Date().getMonth() - expenseDate.getMonth());
                            if (monthDiff < 12) {
                                monthlyTotals[11 - monthDiff] += expense.amount; // Remplir dans l'ordre pour correspondre à l'ordre des mois
                            }
                        }
                    });

                    setMonthlyRevenues(monthlyTotals);
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

    // Génération des mois avec le mois le plus ancien en premier
    const last12Months = getLast12Months();

    // Formatage des données pour recharts
    const chartData = last12Months.map((month, index) => {
        return {
            name: month,
            Dépenses: monthlyRevenues[index] || 0
        };
    });

    return (
        <div className="w-full max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-xl font-bold mb-4 text-center">Revenues des 12 derniers mois</h2>

            {loading ? (
                <p className="text-center">Chargement...</p>
            ) : error ? (
                <p className="text-center text-red-500">{error}</p>
            ) : (
                <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={chartData}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="Dépenses" fill="#38b044" />
                    </BarChart>
                </ResponsiveContainer>
            )}
        </div>
    );
};

export default AnnualRevenueByMonth;
