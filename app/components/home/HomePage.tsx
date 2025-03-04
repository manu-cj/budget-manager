"use client"
import MonthlyExpenseSummary from "./MonthlyExpenseSummary";
import RemainingBudgetSummary from "./RemainingBudgetSummary";
import MonthlyRevenueSummary from "./MonthlyRevenueSummary";


const HomePage: React.FC = () => {

    return(
        <>
        <div className="flex flex-col sm:flex-row sm:space-x-8 p-4 bg-background rounded-lg flex-1 gap-8 justify-center items-center">
            <RemainingBudgetSummary />
            <MonthlyExpenseSummary />
            <MonthlyRevenueSummary />
        </div>
        </>
    )
}
export default HomePage