"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { supabase } from "../../../utils/supabaseClient";
import { TrendingUp } from "lucide-react";
import CustomPieChart from "../../../components/charts/piechart";
import CustomBarChart from "../../../components/charts/barchart";
import CustomLineChart from "../../../components/charts/linechart";
import { IBudget } from "../budget/client-wrapper";
import { ITransaction } from "../transaction/client-wrapper";
import { TABLE_NAMES } from "../../../constant/tables.constant";

interface IDashboardClientWrapperProps {
  transactions: ITransaction[];
  budgets: IBudget[];
}

const DashboardClientWrapper: React.FC<IDashboardClientWrapperProps> = ({
  transactions,
  budgets,
}) => {
  // Calculate metrics
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthlyTransactions = transactions.filter((t) => {
    const transactionDate = new Date(t.transactiondate);
    return (
      transactionDate.getUTCMonth() === currentMonth &&
      transactionDate.getUTCFullYear() === currentYear
    );
  });

  const totalIncome = monthlyTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = Math.abs(
    monthlyTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0)
  );

  const netIncome = totalIncome - totalExpenses;

  // Spending by category
  const categoryData = budgets.map((budget) => ({
    name: budget.categories.name,
    spent: budget.spentAmount,
    budget: budget.budgetlimit,
    remaining: budget.budgetlimit - budget.spentAmount,
  }));

  const [dailySpending, setdailySpending] = useState<any[]>([]);

  // Fetch transactions from Supabase
  const fetchTransaction = async () => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { data, error } = await supabase
      .from(TABLE_NAMES.transactions)
      .select("*")
      .eq("type", "expense") // type = expense
      .gte("transactiondate", sevenDaysAgo.toISOString().split("T")[0]); // YYYY-MM-DD

    if (error) {
      console.error("Error fetching transactions:", error);
    } else {
      setdailySpending(data || []);
    }
  };

  useEffect(() => {
    fetchTransaction();
  }, []);

  return (
    <div className="space-y-6 w-full">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Dashboard</h2>
        <p className="text-muted-foreground">
          Overview of your financial health for this month
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: "Total Income",
            value: totalIncome,
            className: "text-green-600",
          },
          {
            title: "Total Expenses",
            value: totalExpenses,
            className: "text-red-600",
          },
          {
            title: "Net Income",
            value: netIncome,
            className: `${netIncome >= 0 ? "text-green-600" : "text-red-600"}`,
          },

          {
            title: "Transactions",
            value: monthlyTransactions.length,
            className: "",
          },
        ].map((item) => (
          <Card key={item.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {item.title}
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${item.className}`}>
                {item.value.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Spending by Category */}
        <Card>
          <CardHeader>
            <CardTitle>Spending by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <CustomPieChart categoryData={categoryData} />
            </div>
          </CardContent>
        </Card>

        {/* Daily Spending Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Spending (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <CustomLineChart dailySpending={dailySpending} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Budget vs Spending */}
      <Card>
        <CardHeader>
          <CardTitle>Budget vs Actual Spending</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <CustomBarChart categoryData={categoryData} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardClientWrapper;
