"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Auth from "./components/auth/Auth";

import HomePage from "./components/home/HomePage";
import Budget from "./components/transactions/Budget";
import GraphiquePage from "./components/graphiques/GraphiquePage";

export default function ProtectedPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [page, setPage] = useState<string>("home");

  const renderPage = (page: string) => {
    switch (page) {
      case "home":
        return <HomePage />;
      case "transaction":
        return <Budget />;
      case "graphique":
        return <GraphiquePage />;
      default:
        return <h2>404</h2>;
    }
  };

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
      <div className="flex justify-center mt-10">
      <ul className="flex space-x-4 bg-gray-100 p-4 rounded-lg shadow-lg">
        <li>
          <h2
            onClick={() => setPage("transaction")}
            className={`cursor-pointer text-lg font-semibold px-4 py-2 rounded-lg transition duration-200 ease-in-out 
              ${page === "transaction" ? "text-blue-600 font-bold" : "text-gray-800 hover:bg-gray-200 hover:text-blue-400"}`}
          >
            Transactions
          </h2>
        </li>
        <li>
          <h1
            onClick={() => setPage("home")}
            className={`cursor-pointer text-lg font-semibold px-4 py-2 rounded-lg transition duration-200 ease-in-out 
              ${page === "home" ? "text-blue-600 font-bold" : "text-gray-800 hover:bg-gray-200 hover:text-blue-400"}`}
          >
            Résumé
          </h1>
        </li>
        <li>
          <h2
            onClick={() => setPage("graphique")}
            className={`cursor-pointer text-lg font-semibold px-4 py-2 rounded-lg transition duration-200 ease-in-out 
              ${page === "graphique" ? "text-blue-600 font-bold" : "text-gray-800 hover:bg-gray-200 hover:text-blue-400"}`}
          >
            Graphique
          </h2>
        </li>
      </ul>
      </div>

      {loading ? (
        <p className="text-center">Chargement...</p>
      ) : isLogin ? (
        renderPage(page)
      ) : (
        <Auth />
      )}

      {error && <p className="text-center text-red-800">{error}</p>}
    </div>
  );
}
