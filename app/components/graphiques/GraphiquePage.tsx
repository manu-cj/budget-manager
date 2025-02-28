import ExpenseByCategory from "../transactions/ExpenseByCatgory"
import AnnualExpense from "./AnnualExpense"
import AnnualExpensesByCategory from "./AnnualExpensesByCategory"
import AnnualRevenue from "./AnnualRevenues"
import AnnualExpenseByMonth from "./expenseBymonth"
import AnnualRevenueByMonth from "./RevenueByMonth"


const GraphiquePage: React.FC = () => {

    return(
        <>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 p-4 bg-gray-100 rounded-lg">
            <AnnualExpense/>
            <AnnualRevenue/>
            <AnnualExpenseByMonth/>
            <AnnualRevenueByMonth/>
            <ExpenseByCategory/>
            <AnnualExpensesByCategory/>
        </div>
        </>
    )
}
export default GraphiquePage