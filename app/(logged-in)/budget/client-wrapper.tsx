"use client";

import { TrendingUp } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";

import BudgetCard from "../../../components/cards/Budget.card";

export interface IBudget {
  id: string;
  categories: { name: string; id: string };
  budgetlimit: number;
  spentAmount: number; // updated to match API
}

interface IBudgetClientWrapperProps {
  budgetAllocations: IBudget[];
}

const BudgetClientWrapper: React.FC<IBudgetClientWrapperProps> = ({
  budgetAllocations,
}) => {
  // Utility to determine budget status based on spending percentage
  const getBudgetStatus = (spent: number, limit: number) => {
    const percentage = (spent / limit) * 100;
    if (percentage >= 100)
      return { status: "over", color: "text-red-600", bgColor: "bg-red-100" };
    if (percentage >= 80)
      return {
        status: "warning",
        color: "text-orange-600",
        bgColor: "bg-orange-100",
      };
    return { status: "good", color: "text-green-600", bgColor: "bg-green-100" };
  };

  // Calculate totals
  const totalBudget = budgetAllocations.reduce(
    (sum, budget) => sum + budget.budgetlimit,
    0
  );
  const totalSpent = budgetAllocations.reduce(
    (sum, budget) => sum + budget.spentAmount,
    0
  );
  const totalRemaining = totalBudget - totalSpent;

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h2 className="text-2xl font-semibold mb-2">Budget Tracking</h2>
        <p className="text-muted-foreground">
          Monitor your spending against your budgets
        </p>
      </div>

      {/* Budget Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Budget */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalBudget.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Monthly allocation</p>
          </CardContent>
        </Card>

        {/* Total Spent */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {totalSpent.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {((totalSpent / totalBudget) * 100).toFixed(1)}% of budget
            </p>
          </CardContent>
        </Card>

        {/* Remaining */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Remaining</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                totalRemaining >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {totalRemaining.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Available to spend</p>
          </CardContent>
        </Card>
      </div>

      {/* Individual Budget Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {budgetAllocations.map((budget) => {
          const percentage = Math.min(
            (budget.spentAmount / budget.budgetlimit) * 100,
            100
          );
          const remaining = budget.budgetlimit - budget.spentAmount;
          const budgetStatus = getBudgetStatus(
            budget.spentAmount,
            budget.budgetlimit
          );

          return (
            <BudgetCard
              key={budget.id}
              budget={budget}
              budgetStatus={budgetStatus}
              remaining={remaining}
              percentage={percentage}
            />
          );
        })}
      </div>
    </div>
  );
};

export default BudgetClientWrapper;
