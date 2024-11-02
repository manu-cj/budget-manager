import db from '@/app/lib/db';
import { Budget } from '@/app/types/budget';

export const createDefaultBudget = async (userId: string) => {
    db.prepare(`
        INSERT INTO budgets (id) VALUES (?)
    `).run(userId);
};

export const updateBudget = async (userId: string, budget: Budget) => {
    db.prepare(`
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
            gifts_and_events = ?,
            miscellaneous = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?  
    `).run(
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
        budget.gifts_and_events,
        budget.miscellaneous,
        userId
    );
};
