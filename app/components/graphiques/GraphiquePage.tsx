import ExpenseByCategory from "../transactions/ExpenseByCatgory"
import AnnualExpense from "./AnnualExpense"
import AnnualExpensesByCategory from "./AnnualExpensesByCategory"
import AnnualExpenseByMonth from "./expenseBymonth"
import AnnualRevenueByMonth from "./RevenueByMonth"


const GraphiquePage: React.FC = () => {

    return(
        <>
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-8 p-4 bg-gray-100 rounded-lg">
            <AnnualExpense/>
            <AnnualExpenseByMonth/>
            <AnnualRevenueByMonth/>
            <ExpenseByCategory/>
            <AnnualExpensesByCategory/>
        </div>

        </>
    )
}
export default GraphiquePage