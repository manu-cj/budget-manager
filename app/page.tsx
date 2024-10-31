'use client';
import { useEffect, useState } from 'react';

interface Transaction {
  id: number;
  amount: number;
  description: string;
  date: string;
}

export default function HomePage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    fetch('/api/transactions')
      .then((res) => res.json())
      .then((data) => setTransactions(data));
  }, []);

  return (
    <div>
      <h1>Gestion de Budget</h1>
      <ul>
        {transactions.map((transaction) => (
          <li key={transaction.id}>
            {transaction.description} - {transaction.amount}€ - {new Date(transaction.date).toLocaleDateString()}
          </li>
        ))}
      </ul>
    </div>
  );
}
