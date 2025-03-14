"use client"
import MonthlyExpenseSummary from "./MonthlyExpenseSummary";
import RemainingBudgetSummary from "./RemainingBudgetSummary";
import MonthlyRevenueSummary from "./MonthlyRevenueSummary";
import { Expense } from "@/app/types/expense";
import { Budget } from "@/app/types/budget";
import { useEffect, useState } from "react";
import api from '@/app/lib/api';



const HomePage: React.FC = () => {
    const [errorExpense, setErrorExpense] = useState<string | null>(null);
    const [loadingExpense, setLoadingExpense] = useState<boolean>(true);
    const [monthlyTotalExpense, setMonthlyTotalExpense] = useState<number>(0);
    const [errorRevenue, setErrorRevenue] = useState<string | null>(null);
    const [loadingRevenue, setLoadingRevenue] = useState<boolean>(true);
    const [monthlyTotalRevenue, setMonthlyTotalRevenue] = useState<number>(0);
    const [errorBudget, setErrorBudget] = useState<string | null>(null);
    const [loadingBudget, setLoadingBudget] = useState<boolean>(true);
    const [totalBudget, setTotalBudget] = useState<number>(0);

  
    useEffect(() => {
      const fetchRevenue = async () => {
        try {
          const response = await api.get("/api/revenues");
  
          if (response.status === 200) {
            const fetchedExpenses: Expense[] = response.data.expense;
  
            console.log(fetchedExpenses);
  
            const currentMonth = new Date().getMonth();
            const currentYear = new Date().getFullYear();
            const total = fetchedExpenses
              .filter((expense) => {
                const expenseDate = new Date(expense.date);
                return (
                  expenseDate.getMonth() === currentMonth &&
                  expenseDate.getFullYear() === currentYear
                );
              })
              .reduce((sum, expense) => sum + expense.amount, 0);
  
            setMonthlyTotalRevenue(total);
          } else if (response.status === 401) {
            setErrorRevenue(response.data.error);
          } else {
            setErrorRevenue(response.data.error || "Erreur inconnue");
          }
        } catch (error) {
          setErrorRevenue(`Erreur lors de la requête, ${error}`);
        } finally {
          setLoadingRevenue(false);
        }
      };
  
      fetchRevenue();
    }, []);
  
    useEffect(() => {
      /**
       * Fetches the expenses from the API and calculates the total expenses for the current month.
       *
       * This function performs the following steps:
       * 1. Sends a GET request to the `/api/expenses` endpoint to retrieve the expenses.
       * 2. If the response status is 200, it filters the expenses to include only those from the current month and year.
       * 3. Calculates the total amount of the filtered expenses and updates the state with this total.
       * 4. Handles different response statuses (e.g., 401) by setting an appropriate error message.
       * 5. Catches any errors that occur during the request and sets an error message.
       * 6. Ensures that the loading state is set to false once the request is complete.
       *
       * @async
       * @function fetchExpenses
       * @returns {Promise<void>} A promise that resolves when the expenses have been fetched and processed.
       */
      const fetchExpenses = async () => {
        try {
          const response = await api.get("/api/expenses");
  
          if (response.status === 200) {
            const fetchedExpenses: Expense[] = response.data.expense;
  
            console.log(fetchedExpenses);
  
            const currentMonth = new Date().getMonth();
            const currentYear = new Date().getFullYear();
            const total = fetchedExpenses
              .filter((expense) => {
                const expenseDate = new Date(expense.date);
                return (
                  expenseDate.getMonth() === currentMonth &&
                  expenseDate.getFullYear() === currentYear
                );
              })
              .reduce((sum, expense) => sum + expense.amount, 0);
  
            setMonthlyTotalExpense(total);
          } else if (response.status === 401) {
            setErrorExpense(response.data.error);
          } else {
            setErrorExpense(response.data.error || "Erreur inconnue");
          }
        } catch (error) {
          setErrorExpense(`Erreur lors de la requête, ${error}`);
        } finally {
          setLoadingExpense(false);
        }
      };
  
      fetchExpenses();
    }, []);

    
  useEffect(() => {
    const fetchBudget = async () => {
      try {
        const response = await api.get("/api/budget");

        if (response.status === 200) {
          const fetchedBudget = response.data.budget as Budget;

          const total = Object.entries(fetchedBudget)
            .filter(([key]) => key !== "updated_at")
            .reduce((acc, [, value]) => acc + value, 0);

          setTotalBudget(total);
        } else if (response.status === 401) {
          setErrorBudget(response.data.error);
        } else {
          setErrorBudget(response.data.error || "Erreur inconnue");
        }
      } catch (error) {
        setErrorBudget(`Erreur lors de la requête, ${error}`);
      } finally {
        setLoadingBudget(false);
      }
    };

    fetchBudget();
  }, [monthlyTotalExpense]);

    return(
        <>
        <div className="flex flex-col sm:flex-row sm:space-x-8 p-4 bg-background rounded-lg flex-1 gap-8 justify-center items-center">
            <RemainingBudgetSummary error={errorBudget} loading={loadingBudget} monthlyTotal={monthlyTotalExpense} totalBudget={totalBudget} />
            <MonthlyExpenseSummary error={errorExpense} loading={loadingExpense} monthlyTotal={monthlyTotalExpense} />
            <MonthlyRevenueSummary error={errorRevenue} loading={loadingRevenue} monthlyTotal={monthlyTotalRevenue} />
            

            
        </div>
        </>
    )
}
export default HomePage