"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import api from './../../lib/api';
import {
  FaBriefcase,
  FaChartLine,
  FaShoppingCart,
  FaMoneyBillWave,
  FaQuestionCircle,
  FaCube,
  FaTrash,
} from "react-icons/fa";
import DeleteTransaction from "../forms/DeleteTransaction";


type Expense = {
  _id: string;
  description: string;
  amount: number;
  date: string;
  category_id: string;
};

const AllRevenues: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [limit] = useState<number>(10);
  const [offset, setOffset] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [showDeleteTransaction, setShowDeleteTransaction] = useState<boolean>(false);
  const [transactionId, setTransactionId] = useState<string>('');
  const [transactionTitle, setTransactionTitle] = useState<string>('');
  const [transactionPrice, setTransactionPrice] = useState<string>('');
  const loadedIds = useRef(new Set<string>());

  const categoryIcons: Record<string, JSX.Element> = {
    "67e1834a41ae0f5f3775794d": <FaMoneyBillWave className="text-green-500 text-2xl md:text-3xl" />,
    "67e1834a41ae0f5f3775794e": <FaBriefcase className="text-blue-500 text-2xl md:text-3xl" />,
    "67e1834a41ae0f5f3775794f": <FaChartLine className="text-indigo-500 text-2xl md:text-3xl" />,
    "67e1834a41ae0f5f37757950": <FaShoppingCart className="text-orange-500 text-2xl md:text-3xl" />,
    "67e1834a41ae0f5f37757951": <FaCube className="text-gray-500 text-2xl md:text-3xl" />,
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
      const response = await api.get("/api/revenues-by-page", {
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
                setShowDeleteTransaction(true);
                setTransactionId(expense._id.toString());
                setTransactionTitle(expense.description);
                setTransactionPrice(expense.amount.toFixed(2));
              }}
            >
              <FaTrash></FaTrash>
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
        {showDeleteTransaction && (
          <DeleteTransaction onClose={() => setShowDeleteTransaction(false)} transactionId={transactionId} route="revenues" title={transactionTitle} price={transactionPrice} />
        )}
        {loading && (
          <p className="text-center text-gray-500 mt-4">Chargement...</p>
        )}
      </div>
    </>
  );
};

export default AllRevenues;
