"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Auth from "./components/auth/Auth";
import MonthlyExpenseSummary from "./components/home/MonthlyExpenseSummary";
import RemainingBudgetSummary from "./components/home/RemainingBudgetSummary";
import MonthlyRevenueSummary from "./components/home/MonthlyRevenueSummary";

export default function ProtectedPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isLogin, setIsLogin] = useState<boolean>(false);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const response = await axios.get("/api/protected");

        if (response.status === 200) {
          setIsLogin(true);
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

    checkLogin();
  }, []);

  return (
<div className="flex flex-col min-h-screen p-4 bg-gray-100 rounded-lg shadow-md">
  <h1 className="text-center text-gray-800 text-2xl font-semibold mb-4">résumé</h1>

  {loading ? (
    <p className="text-center">Chargement...</p>
  ) : isLogin ? (
    <div className="flex flex-col sm:flex-row sm:space-x-8 p-4 bg-gray-100 rounded-lg flex-1 gap-4">
      <MonthlyExpenseSummary />
      <MonthlyRevenueSummary />
      <RemainingBudgetSummary />
    </div>
  ) : (
    <Auth />
  )}

  {error && <p className="text-center text-red-800">{error}</p>}
</div>

  );
}
