'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewTransaction() {
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: parseFloat(amount), description, date }),
    });
    router.push('/');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Ajouter une Transaction</h2>
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        required
      />
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Montant"
        required
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />
      <button type="submit">Ajouter</button>
    </form>
  );
}
