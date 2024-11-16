import React, { useEffect, useState } from "react";
import { Budget } from "@/app/types/budget";
import axios from "axios";

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
  gifts_and_events: "Cadeaux et événements",
  miscellaneous: "Divers",
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
    gifts_and_events: 0,
    miscellaneous: 0,
  });


  useEffect(() => {
const fetchBudget = async () => {
    try {
        const response = await axios.get("/api/budget");
        if (response.status === 200) {
            const budgetData: Budget = response.data.budget
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
                gifts_and_events: budgetData.gifts_and_events,
                miscellaneous: budgetData.miscellaneous,
            });
        }
        else if (response.status === 401) {
            console.log(response.data.error);
          } else {
            console.log(response.data.error || "Erreur inconnue");
          }
        
    } catch (error) {
        console.log(`Erreur lors de la requête, ${error}`);
    }
}
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
      const response = await axios.patch("/api/budget", budget);
      console.log("Budget updated:", response.data);
      window.location.reload();
    } catch (error) {
      console.error("Error updating budget:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg overflow-y-auto max-h-[90vh] relative">
      {/* Bouton de fermeture avec croix rouge en position fixed */}
      <button
        onClick={onClose}
        className="absolute top-1 right-4 text-red-600 text-3xl font-bold hover:text-red-700 focus:outline-none"
      >
        &times; {/* Symbole de la croix */}
      </button>
      <h2 className="text-xl text-gray-800 font-semibold text-center mb-6">
        Mettre à jour le budget
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {Object.keys(budget).map((key) => (
          <div key={key} className="flex flex-col">
            <label
              htmlFor={key}
              className="text-sm font-medium text-gray-700 capitalize"
            >
              {categoryTranslations[key] || key.replace(/_/g, " ")} {/* Affiche la traduction si disponible */}
            </label>
            <input
              id={key}
              name={key}
              type="number"
              value={budget[key as keyof Budget]}
              onChange={handleChange}
              className="mt-1 p-3 border text-gray-800 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        ))}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-semibold py-3 px-6 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Mettre à jour
        </button>
      </form>
    </div>
  </div>
  

  
  );
};

export default UpdateBudget;
