// import { Budget } from './../types/budget';
import Budget from '../models/Budget';
import { IBudget } from '../models/Budget';


export const createDefaultBudget = async (userId: string) => {
    try {
        const newBudget = new Budget({
            user_id: userId,
        });

        await newBudget.save();
    } catch (error) {
        console.error('Erreur lors de la création du budget par défaut :', error);
        throw new Error('Erreur lors de la création du budget par défaut');
    }
};


export async function updateBudget(userId: string, budgetData: Partial<IBudget>): Promise<Omit<IBudget, '_id' | 'user_id' | 'created_at' | 'updated_at'>> {
    try {
        const updatedBudget = await Budget.findOneAndUpdate(
            { user_id : userId },
            { $set: budgetData }, // Mise à jour des données
            { new: true }  // Retourne le document mis à jour
        );

        if (!updatedBudget) {
            throw new Error("Aucun budget trouvé pour cet utilisateur.");
        }

        return updatedBudget;
    } catch (error) {
        console.error("Erreur lors de la mise à jour du budget : ", error);
        throw new Error("Erreur lors de la mise à jour du budget");
    }
}


export const getBudget = async (userId: string): Promise<Omit<IBudget, '_id' | 'user_id' | 'created_at' | 'updated_at'> | null> => {
    try {
        const budget = await Budget.findOne({ user_id: userId }).select('-_id -user_id -created_at -updated_at');

        return budget ? budget.toObject() : null;
    } catch (error) {
        console.error('Erreur lors de la récupération du budget :', error);
        throw new Error('Erreur lors de la récupération du budget');
    }
};

export const deleteLastBudget = async () => {
    try {
        const deletedBudget = await Budget.findOneAndDelete().sort({ _id: -1 });

        if (!deletedBudget) {
            throw new Error("Aucun budget trouvé à supprimer");
        }
    } catch (error) {
        console.error('Erreur lors de la suppression du dernier budget :', error);
        throw new Error('Erreur lors de la suppression du dernier budget');
    }
};
