import db from './../lib/db';
import { Budget } from './../types/budget';

export const createDefaultBudget = async (userId: string) => {
    db.prepare(`
        INSERT INTO budgets (id) VALUES (?)
    `).run(userId);
};

export const updateBudget = async (userId: string, budget: Budget) => {
    try {
        const stmt = db.prepare(`
            UPDATE budgets SET
                housing = ?,
                food = ?,
                transportation = ?,
                health = ?,
                leisure = ?,
                subscriptions = ?,
                insurance = ?,
                education = ?,
                repayments = ?,
                savings = ?,
                animals = ?,
                gifts_and_events = ?,
                miscellaneous = ?,
                vacation = ?,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?  
        `);
        const result = stmt.run(
            budget.housing,
            budget.food,
            budget.transportation,
            budget.health,
            budget.leisure,
            budget.subscriptions,
            budget.insurance,
            budget.education,
            budget.repayments,
            budget.savings,
            budget.animals,
            budget.gifts_and_events,
            budget.miscellaneous,
            budget.vacation,
            userId
        );

        if (result.changes === 0) {
            throw new Error("Aucun budget trouvé ou utilisateur non autorisé");
        }

        return { success: true, message: "Budget mis à jour avec succès" };
        
    } catch (error:unknown) {
        if (error instanceof Error) {
            console.error(error);
            return new Response('Error updating budget: ' + error.message, { status: 500 });
          }
          return new Response(JSON.stringify({ error: 'Erreur inconnue' }), { status: 500 });
        
    }
};

export const getBudget = async (userId: string): Promise<Budget | null> => {
    const row = db.prepare(`
        SELECT
            housing,
            food,
            transportation,
            health,
            leisure,
            subscriptions,
            insurance,
            education,
            repayments,
            savings,
            animals,
            gifts_and_events,
            miscellaneous,
            vacation,
            updated_at
        FROM budgets
        WHERE id = ?
    `).get(userId) as Budget;
        console.log(userId);
        
    return row || null;
};

export const deleteLastBudget = async () => {
    db.prepare(`
        DELETE FROM budgets
        WHERE id = (SELECT id FROM budgets ORDER BY id DESC LIMIT 1)
    `).run();
};
