"use client";
 import {  useState } from "react";
// import api from '@/app/lib/api';
// import { Expense } from "@/app/types/expense";

import AddExpenseModal from "../forms/AddExpense";
import TotalExpenses from "../ui/card/BudgetCard";

interface ExpenseProps {
  error : string | null;
  loading : boolean;
  monthlyTotal : number;
}

const MonthlyExpenseSummary: React.FC<ExpenseProps> = ( {error, loading, monthlyTotal}) => {
  const [showAddExpense, setShowAddExpense] = useState<boolean>(false); // État pour afficher/cacher UpdateBudget

  
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
