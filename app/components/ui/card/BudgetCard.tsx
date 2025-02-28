import { FaWallet } from "react-icons/fa";

interface TotalExpensesProps {
  monthlyTotal: number;
  onButton: () => void;
  title: string;
  type: string;
  isButton?: boolean;
}

const TotalExpenses: React.FC<TotalExpensesProps> = ({ monthlyTotal, onButton, title, type, isButton }) => {
  return (
    <div className="w-full max-w-md p-0 bg-secondary rounded-2xl shadow-lg border border-secondary-dark flex flex-col items-center space-y-6 pb-6 pr-6 pl-6">
      {/* Titre et icône */}
      <div className="w-72 p-4 rounded-2xl flex flex-col space-y-2 relative">
        <div className={`absolute -top-6 -left-10 p-5 rounded-full border-8 border-background ${type === 'expense' ? 'bg-red-400' : 'bg-green-600'}`}>
          <FaWallet className="text-white text-xl" />
        </div>
      </div>
      <h2 className="text-lg font-bold text-primary"> {title} </h2>

      {/* Montant total */}
      <p className="text-3xl font-extrabold text-primary">
        {monthlyTotal.toFixed(2)} €
      </p>
      
      {/* Bouton d'ajout */}
    {isButton && (
        <button
            onClick={onButton}
            className={`${
                type === 'expense' ? 'bg-red-400 hover:bg-red-500' : 'bg-green-600 hover:bg-green-700'
                } text-text-light py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-dark focus:ring-offset-2`}
        >
            {type === 'expense' ? 'Ajouter une dépense' : 'Ajouter un revenu'}
        </button>
    )}
    </div>
    
  );
};

export default TotalExpenses;
