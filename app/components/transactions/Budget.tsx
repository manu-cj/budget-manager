"use client"

import { useState } from "react"
import AllExpenses from "./AllExpenses"
import AllRevenues from "./AllRevenues"

const Budget: React.FC = () => {
    const [request, setRequest] = useState<string>('Expenses');


    return (
        <>
          <div className="flex justify-center space-x-4 mb-4">
            <button
              onClick={() => setRequest('Expenses')}
              className={`px-4 py-2 font-semibold rounded-lg transition ${
                request === 'Expenses'
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Dépenses
            </button>
            <button
              onClick={() => setRequest('Revenues')}
              className={`px-4 py-2 font-semibold rounded-lg transition ${
                request === 'Revenues'
                  ? 'bg-green-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Revenus
            </button>
          </div>
          <div className="container mx-auto px-1">
            {request === 'Expenses' ? <AllExpenses /> : <AllRevenues />}
          </div>
        </>
      );
      
}
export default Budget