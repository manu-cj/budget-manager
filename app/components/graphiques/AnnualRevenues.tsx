"use client";
import { useEffect, useState } from "react";
import api from './../../lib/api';
import { Expense } from "./../../types/expense";
import TotalExpenses from "../ui/card/BudgetCard";
import AddRevenue from "../forms/AddRevenue";

const AnnualRevenue: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [annualTotal, setAnnualTotal] = useState<number>(0);
  const [showAddRevenue, setShowAddRevenue] = useState<boolean>(false);

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

          setAnnualTotal(total);
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
        <TotalExpenses
          monthlyTotal={annualTotal}
          onButton={() => setShowAddRevenue(true)}
          title={"Total des revenues de l'année"}
          type={"revenue"}
          isButton={false}
        />
      )}

      {/* Modale d'ajout */}
      {showAddRevenue && (
        <AddRevenue onClose={() => setShowAddRevenue(false)} />
      )}
    </div>
  );
};

export default AnnualRevenue;
