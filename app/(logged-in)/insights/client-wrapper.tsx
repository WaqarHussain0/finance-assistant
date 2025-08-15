"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import {
  Brain,
  TrendingUp,
  Target,
  Lightbulb,
  PiggyBank,
  Calendar,
  DollarSign,
  LucideIcon,
} from "lucide-react";
import { IBudget } from "../budget/client-wrapper";
import { ITransaction } from "../transaction/client-wrapper";
import SmartInsightCard from "../../../components/cards/SmartInsight.card";
import SpendingPredictionCard from "../../../components/cards/SpedningPrediction.card";

interface IInsightClientWrapper {
  budgets: IBudget[];
  transactions: ITransaction[];
  aiInsights?: any;
}

type IconName = "PiggyBank" | "Calendar" | "DollarSign";

const iconMap: Record<IconName, LucideIcon> = {
  PiggyBank,
  Calendar,
  DollarSign,
};

interface IFinancialHealthDetail {
  icon: IconName; // restrict to valid icon keys
  color: string;
  label: string;
  status: string;
}

const InsightClientWrapper: React.FC<IInsightClientWrapper> = ({
  budgets,
  transactions,
  aiInsights,
}) => {
  // AI-powered insights (mock implementation)
  const generateInsights = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const monthlyTransactions = transactions.filter((t) => {
      const transactionDate = new Date(t.transactiondate);
      return (
        transactionDate.getMonth() === currentMonth &&
        transactionDate.getFullYear() === currentYear
      );
    });

    const totalExpenses = Math.abs(
      monthlyTransactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0)
    );

    const totalIncome = monthlyTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    // Category analysis
    const categorySpending = budgets.map((budget) => ({
      category: budget.categories.name,
      spent: budget.spentAmount,
      budget: budget.budgetlimit,
      percentage: (budget.spentAmount / budget.budgetlimit) * 100,
    }));

    const overBudgetCategories = categorySpending.filter(
      (c) => c.percentage >= 100
    );
    const highSpendingCategories = categorySpending
      .filter((c) => c.percentage >= 80 && c.percentage < 100)
      .sort((a, b) => b.percentage - a.percentage);

    const insights = [];

    // Budget alerts
    if (overBudgetCategories.length > 0) {
      insights.push({
        type: "alert",
        title: "Budget Exceeded",
        description: `You've exceeded your budget in ${
          overBudgetCategories.length
        } categor${
          overBudgetCategories.length > 1 ? "ies" : "y"
        }: ${overBudgetCategories.map((c) => c.category).join(", ")}.`,
        action:
          "Consider reducing spending in these categories or adjusting your budget limits.",
        priority: "high",
      });
    }

    if (highSpendingCategories.length > 0) {
      insights.push({
        type: "warning",
        title: "Approaching Budget Limits",
        description: `You're close to your budget limit in ${
          highSpendingCategories[0].category
        } (${highSpendingCategories[0].percentage.toFixed(1)}% used).`,
        action: "Monitor your spending closely for the rest of the month.",
        priority: "medium",
      });
    }

    // Savings opportunities
    const foodSpending = categorySpending.find(
      (c) => c.category === "Food & Dining"
    );
    if (foodSpending && foodSpending.percentage > 60) {
      insights.push({
        type: "tip",
        title: "Dining Out Optimization",
        description: `You've spent ${foodSpending.spent.toFixed(
          2
        )} on food and dining this month.`,
        action:
          "Consider meal planning and cooking at home more often to save money.",
        priority: "low",
      });
    }

    // Income vs expenses analysis
    const savingsRate = ((totalIncome - totalExpenses) / totalIncome) * 100;
    if (savingsRate < 20) {
      insights.push({
        type: "tip",
        title: "Improve Savings Rate",
        description: `Your current savings rate is ${savingsRate.toFixed(
          1
        )}%. Financial experts recommend saving at least 20% of your income.`,
        action:
          "Look for areas to reduce expenses or consider increasing your income.",
        priority: "medium",
      });
    } else if (savingsRate >= 20) {
      insights.push({
        type: "success",
        title: "Great Savings Rate!",
        description: `You're saving ${savingsRate.toFixed(
          1
        )}% of your income this month. Keep up the excellent work!`,
        action: "Consider investing your savings for long-term growth.",
        priority: "low",
      });
    }

    return insights;
  };

  const generatePredictions = () => {
    const predictions = [];

    // Monthly spending prediction
    const currentDate = new Date();
    const dayOfMonth = currentDate.getDate();
    const daysInMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    ).getDate();

    const monthlyExpenses = Math.abs(
      transactions
        .filter((t) => {
          const transactionDate = new Date(t.transactiondate);
          return (
            transactionDate.getMonth() === currentDate.getMonth() &&
            transactionDate.getFullYear() === currentDate.getFullYear() &&
            t.type === "expense"
          );
        })
        .reduce((sum, t) => sum + t.amount, 0)
    );

    const dailyAverage = monthlyExpenses / dayOfMonth;
    const projectedMonthlySpending = dailyAverage * daysInMonth;

    predictions.push({
      title: "Monthly Spending Forecast",
      current: monthlyExpenses,
      predicted: projectedMonthlySpending,
      description: `Based on your current spending pattern, you're projected to spend $${projectedMonthlySpending.toFixed(
        2
      )} this month.`,
      trend: projectedMonthlySpending > monthlyExpenses ? "up" : "down",
    });

    // Category predictions
    budgets.forEach((budget) => {
      if (budget.spentAmount > 0) {
        const projectedSpending =
          (budget.spentAmount / dayOfMonth) * daysInMonth;
        if (projectedSpending > budget.budgetlimit * 0.8) {
          predictions.push({
            title: `${budget.categories.name} Forecast`,
            current: budget.spentAmount,
            predicted: projectedSpending,
            description: `You may exceed your ${budget.categories.name} budget if current spending continues.`,
            trend: "up",
          });
        }
      }
    });

    return predictions;
  };

  const insights = generateInsights();
  const predictions = generatePredictions();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Brain className="h-8 w-8 text-purple-600" />
        <div>
          <h2 className="text-2xl font-semibold">AI Financial Insights</h2>
          <p className="text-muted-foreground">
            Personalized recommendations and predictions
          </p>
        </div>
      </div>

      {/* AI Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Smart Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            {insights.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No insights available yet.</p>
                <p className="text-sm">
                  Add more transactions to get personalized recommendations.
                </p>
              </div>
            ) : (
              aiInsights.insights.map((insight: any, index: any) => (
                <SmartInsightCard insight={insight} key={index} />
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Predictions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Spending Predictions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {aiInsights.predictions.map((prediction: any, index: any) => (
              <SpendingPredictionCard prediction={prediction} key={index} />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Financial Health Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Financial Health Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div
              className={`text-4xl font-bold mb-2 text-${
                aiInsights?.financialHealth?.score >= 75
                  ? "green"
                  : aiInsights?.financialHealth?.score >= 50
                  ? "yellow"
                  : "red"
              }-600`}
            >
              {aiInsights?.financialHealth?.score}
            </div>
            <p className="text-muted-foreground mb-4">
              {aiInsights?.financialHealth?.rating}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              {aiInsights?.financialHealth?.details?.map(
                (detail: IFinancialHealthDetail, index: number) => {
                  const Icon = iconMap[detail.icon] || PiggyBank;
                  return (
                    <div key={index} className="text-center">
                      <Icon
                        className={`h-6 w-6 mx-auto mb-2 text-${detail.color}-500`}
                      />
                      <div className="font-medium">{detail.label}</div>
                      <div className="text-muted-foreground">
                        {detail.status}
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InsightClientWrapper;
