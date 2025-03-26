import React, { useEffect, useState } from "react";
import { Budget } from "./../../types/budget";
import api from './../../lib/api';

// Mapping des catégories de budget en français
const categoryTranslations: Record<string, string> = {
  housing: "Logement",
  food: "Nourriture",
  transportation: "Transport",
  health: "Santé",
  leisure: "Loisirs",
  subscriptions: "Abonnements",
  insurance: "Assurance",
  education: "Éducation",
  repayments: "Remboursements",
  savings: "Économies",
  animals: "animaux",
  gifts_and_events: "Cadeaux et événements",
  miscellaneous: "Divers",
  vacation: "vacances"
};

const UpdateBudget: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [budget, setBudget] = useState<Partial<Budget>>({
    housing: 0,
    food: 0,
    transportation: 0,
    health: 0,
    leisure: 0,
    subscriptions: 0,
    insurance: 0,
    education: 0,
    repayments: 0,
    savings: 0,
    animals: 0,
    gifts_and_events: 0,
    miscellaneous: 0,
    vacation: 0
  });


  useEffect(() => {
const fetchBudget = async () => {
  try {
    const response = await api.get("/api/budget");
    if (response.status === 200) {
      const budgetData: Budget = response.data.budget;
      setBudget({
        housing: budgetData.housing,
        food: budgetData.food,
        transportation: budgetData.transportation,
        health: budgetData.health,
        leisure: budgetData.leisure,
        subscriptions: budgetData.subscriptions,
        insurance: budgetData.insurance,
        education: budgetData.education,
        repayments: budgetData.repayments,
        savings: budgetData.savings,
        animals: budgetData.animals,
        gifts_and_events: budgetData.gifts_and_events,
        miscellaneous: budgetData.miscellaneous,
        vacation: budgetData.vacation,
      });
    }
  } catch (error) {
    console.error("Erreur lors de la récupération du budget :", error);
  }
};
fetchBudget()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBudget((prevBudget) => ({
      ...prevBudget,
      [name]: parseFloat(value) || 0,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    
    
    e.preventDefault();
    try {
      console.table(budget)
      await api.patch("/api/budget", budget);
      
      window.location.reload();
    } catch (error) {
      console.error("Error updating budget:", error);
    }
  };

  return (
<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
  <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg overflow-y-auto max-h-[90vh] relative flex flex-col">

    {/* Titre centré avec une ligne décorative */}
    <div className="text-center mb-6">
      <h2 className="text-2xl font-semibold text-gray-800">Mettre à jour le budget</h2>
      <div className="mt-2 mx-auto w-16 h-1 bg-blue-500 rounded"></div>
    </div>

    {/* Contenu du formulaire avec champs modifiables */}
    <form className="space-y-6 flex-1 overflow-auto">
      {Object.keys(budget).map((key) => (
        <div key={key} className="flex flex-col">
          <label
            htmlFor={key}
            className="text-sm font-medium text-gray-700 capitalize mb-1"
          >
            {categoryTranslations[key] || key.replace(/_/g, " ")}
          </label>
          <input
            id={key}
            name={key}
            type="number"
            value={budget[key as keyof Budget]}
            onChange={handleChange}
            className="p-3 border border-gray-300 rounded-lg shadow-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            placeholder="Entrez un montant"
          />
        </div>
      ))}
    </form>

    {/* Conteneur pour les boutons de soumission et annulation, positionné en bas */}
    <div className="flex justify-between gap-4 mt-6 pt-4 border-t border-gray-200">
      <button
        type="button"
        onClick={onClose}
        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
      >
        Annuler
      </button>
      <button
      onClick={handleSubmit}
        type="submit"
        className="w-1/2 sm:w-auto bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition"
      >
        Mettre à jour
      </button>
    </div>
  </div>
</div>

  

  
  );
};

export default UpdateBudget;
