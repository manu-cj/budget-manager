'use client';

import React, { useState, useEffect } from 'react';
import { Category } from '@/app/types/category';
import api from '@/app/lib/api';

const AddExpenseModal: React.FC<{ onClose: () => void }> = ({ onClose }) =>{
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [category_id, setCategory_id] = useState<number>();
  const [categories, setCategories] = useState<Array<Category>>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/api/expense-categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des catégories :', error);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      console.log(category_id);
  
      await api.post('/api/expenses', {
        amount: parseFloat(amount),
        description,
        date,
        category_id,
      });
  
      window.location.reload(); // Rafraîchir la page après l'ajout de la dépense
    } catch (error) {
      console.error("Erreur lors de l'ajout de la dépense :", error);
    }
  };
  

  return (
    <>

    
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg overflow-y-auto max-h-[90vh] relative flex flex-col">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Ajouter une dépense</h2>
            <form onSubmit={handleSubmit}>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
                  Catégorie
                </label>
                <select
                  id="category"
                  value={category_id}
                  onChange={(e) => setCategory_id(Number(e.target.value))}
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="">
                    Choisissez une catégorie
                  </option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                  Description
                </label>
                <input
                  type="text"
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Description"
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amount">
                  Montant
                </label>
                <input
                  type="number"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Montant"
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date">
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Ajouter
                </button>
              </div>
            </form>
          </div>
        </div>
    </>
  );
};

export default AddExpenseModal;
