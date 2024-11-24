"use client"

const Budget: React.FC = () => {

    return(
        <>
        <div className="flex flex-col items-center mt-10 px-4">
            <h2 className="text-2xl font-bold text-black mb-6">Liste des dépenses</h2>
            
            <div className="w-full max-w-md bg-white shadow-md rounded-lg p-4">
                <ul className="divide-y divide-gray-200">
                <li className="flex justify-between items-center py-3">
                    <span className="text-gray-800 font-medium">Abonnement Netflix</span>
                    <span className="text-red-500 font-bold">- 15€</span>
                </li>
                <li className="flex justify-between items-center py-3">
                    <span className="text-gray-800 font-medium">Course hebdomadaire</span>
                    <span className="text-red-500 font-bold">- 120€</span>
                </li>
                <li className="flex justify-between items-center py-3">
                    <span className="text-gray-800 font-medium">Transport</span>
                    <span className="text-red-500 font-bold">- 45€</span>
                </li>
                <li className="flex justify-between items-center py-3">
                    <span className="text-gray-800 font-medium">Café</span>
                    <span className="text-red-500 font-bold">- 5€</span>
                </li>
                </ul>
            </div>
        </div>
        </>
    )
}
export default Budget