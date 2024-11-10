"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Auth from "./components/auth/Auth";
import { Expense } from "./types/expense";

export default function ProtectedPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [expenses, setExpenses] = useState<Expense[]>([]);

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

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await axios.get("/api/expenses");

        if (response.status === 200) {
          console.log(response.data);
          
          setExpenses([]);
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
  }, [])

  return (
    <div>
      <h1>Page protégée</h1>

      {loading ? <p>Chargement...</p> : isLogin ? <p>Connecté</p> : <Auth/>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
