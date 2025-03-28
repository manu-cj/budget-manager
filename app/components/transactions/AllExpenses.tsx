"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import api from './../../lib/api';
import {
  FaHome,
  FaUtensils,
  FaBus,
  FaHeartbeat,
  FaSmile,
  FaRedo,
  FaShieldAlt,
  FaBook,
  FaMoneyBillWave,
  FaPiggyBank,
  FaPaw,
  FaGift,
  FaQuestionCircle,
  FaPlane,
  FaTrash
} from "react-icons/fa";
import DeleteTransaction from "../forms/DeleteTransaction";

type Expense = {
  _id: string;
  description: string;
  amount: number;
  date: string;
  category_id: string;
};

const AllExpenses: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [limit] = useState<number>(10);
  const [offset, setOffset] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [showDeleteExpense, setShowDeleteExpense] = useState<boolean>(false);
  const [transactionId, setTransactionId] = useState<string>('');
  const [transactionTitle, setTransactionTitle] = useState<string>('');
  const [transactionPrice, setTransactionPrice] = useState<string>('');
  const loadedIds = useRef(new Set<string>());

  const categoryIcons: Record<string, JSX.Element> = {
    "67e1624441ae0f5f37757667": <FaHome className="text-indigo-500 text-2xl md:text-3xl" />,
    "67e1624441ae0f5f37757668": <FaUtensils className="text-green-500 text-2xl md:text-3xl" />,
    "67e1624441ae0f5f37757669": <FaBus className="text-blue-500 text-2xl md:text-3xl" />,
    "67e1624441ae0f5f3775766a": <FaHeartbeat className="text-red-500 text-2xl md:text-3xl" />,
    "67e1624441ae0f5f3775766b": <FaSmile className="text-yellow-500 text-2xl md:text-3xl" />,
    "67e1624441ae0f5f3775766c": <FaRedo className="text-orange-500 text-2xl md:text-3xl" />,
    "67e1624441ae0f5f3775766d": <FaShieldAlt className="text-teal-500 text-2xl md:text-3xl" />,
    "67e1624441ae0f5f3775766e": <FaBook className="text-blue-400 text-2xl md:text-3xl" />,
    "67e1624441ae0f5f3775766f": <FaMoneyBillWave className="text-green-400 text-2xl md:text-3xl" />,
    "67e1624441ae0f5f37757670": <FaPiggyBank className="text-pink-500 text-2xl md:text-3xl" />,
    "67e1624441ae0f5f37757671": <FaPaw className="text-brown-500 text-2xl md:text-3xl" />,
    "67e1624441ae0f5f37757672": <FaGift className="text-purple-500 text-2xl md:text-3xl" />,
    "67e1624441ae0f5f37757673": <FaQuestionCircle className="text-gray-500 text-2xl md:text-3xl" />,
    "67e1624441ae0f5f37757674": <FaPlane className="text-cyan-500 text-2xl md:text-3xl" />,
  };

  const getIconByCategory = (categoryId: string) =>
    categoryIcons[categoryId] || (
      <FaQuestionCircle className="text-gray-500 text-2xl md:text-3xl" />
    );

  const fetchExpenses = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    setError(null);

    try {
      const response = await api.get("/api/expenses-by-page", {
        params: { limit, offset },
        withCredentials: true,
      });

      if (response.status === 200) {
        const fetchedExpenses = response.data.expense;
        const newExpenses = fetchedExpenses.filter(
          (expense: Expense) => !loadedIds.current.has(expense._id)
        );

        if (newExpenses.length === 0) {
          setHasMore(false);
        } else {
          setExpenses((prev) => [...prev, ...newExpenses]);
          newExpenses.forEach((expense: Expense) =>
            loadedIds.current.add(expense._id)
          );
          setOffset((prev) => prev + newExpenses.length);
        }
      } else {
        setError("Erreur lors de la récupération des données");
      }
    } catch (err) {
      setError("Erreur de connexion : " + err);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, limit, offset]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const target = e.target as HTMLDivElement;
      if (
        !loading &&
        hasMore &&
        target.scrollTop + target.clientHeight >= target.scrollHeight - 50
      ) {
        fetchExpenses();
      }
    },
    [loading, hasMore, fetchExpenses]
  );

  

  return (
    <>
      {error && (
        <p className="text-red-600 text-center mb-4 border border-red-500 rounded p-2 bg-red-100">
          {error}
        </p>
      )}

      <div
        className="w-full max-w-full sm:max-w-md h-[500px] overflow-y-scroll bg-white rounded-lg shadow-lg p-4 border border-gray-200 mx-auto"
        onScroll={handleScroll}
      >
        <ul className="space-y-2">
          {expenses.map((expense, index) => (
            <li
              key={`${expense._id}-${index}`}
              className="flex items-center justify-between bg-gray-50 hover:bg-gray-100 p-3 rounded-lg shadow-sm border border-gray-200 transition-all duration-200 relative group"
            >
              <div className="flex items-center space-x-4">
              {getIconByCategory(expense.category_id)}
              </div>
              <div className="flex-grow max-w-[65%]">
              <p className="text-sm font-bold text-gray-800">
                {expense.description}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(expense.date).toLocaleDateString("fr-FR")}
              </p>
              </div>
              <div className="flex items-center space-x-4">
              <p className="text-lg font-semibold text-orange-600 group-hover:mr-8 transition-all duration-200">
                {expense.amount.toFixed(2)} €
              </p>
                <button
                className="bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute right-2"
                onClick={() => {
                  setShowDeleteExpense(true);
                  setTransactionId(expense._id);
                  setTransactionTitle(expense.description);
                  setTransactionPrice(expense.amount.toFixed(2));
                }}
                >
                <FaTrash />
                </button>
              </div>
            </li>
          ))}
        </ul>
        {!hasMore && (
          <p className="text-center text-gray-500 mt-4">
            Toutes les données ont été chargées.
          </p>
        )}
        {showDeleteExpense && (
          <DeleteTransaction onClose={() => setShowDeleteExpense(false)} transactionId={transactionId} route="expenses" title={transactionTitle} price={transactionPrice} />
        )}
        {loading && (
          <p className="text-center text-gray-500 mt-4">Chargement...</p>
        )}
        
      </div>
    </>
  );
};

export default AllExpenses;
