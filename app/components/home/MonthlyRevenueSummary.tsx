"use client";
import {  useState } from "react";

import TotalExpenses from "../ui/card/BudgetCard";
import AddRevenue from "../forms/AddRevenue";

interface RevenueProps {
  error : string | null;
  loading : boolean;
  monthlyTotal : number;
}

const MonthlyRevenueSummary: React.FC<RevenueProps> = ({error, loading, monthlyTotal}) => {

  const [showAddRevenue, setShowAddRevenue] = useState<boolean>(false); // État pour afficher/cacher UpdateBudget



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
