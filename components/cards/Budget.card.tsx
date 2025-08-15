"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Progress } from "../../components/ui/progress";
import { Edit, AlertTriangle, CheckCircle } from "lucide-react";
import EditBudgetAllocationModal from "../modals/EditBudgetAllocation.modal";
import { IBudget } from "../../app/(logged-in)/budget/client-wrapper";
import { useState } from "react";

interface IBudgetCardProps {
  budget: any;
  budgetStatus: any;
  percentage: any;
  remaining: any;
}

const BudgetCard: React.FC<IBudgetCardProps> = ({
  budget,
  budgetStatus,
  percentage,
  remaining,
}) => {
  const [editingBudget, setEditingBudget] = useState<IBudget | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "over":
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      default:
        return <CheckCircle className="h-4 w-4 text-green-600" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{budget.categories.name}</CardTitle>
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                {
                  setEditingBudget(budget);
                  setIsEditDialogOpen(true);
                }
              }}
            >
              <Edit className="h-4 w-4" />
            </Button>
            {getStatusIcon(budgetStatus.status)}
          </div>

          {isEditDialogOpen && editingBudget && (
            <EditBudgetAllocationModal
              setIsEditDialogOpen={setIsEditDialogOpen}
              budget={editingBudget}
            />
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between text-sm">
          <span>Spent: {budget?.spent?.toFixed(2)}</span>
          <span>Budget: {budget?.budgetlimit?.toFixed(2)}</span>
        </div>

        <Progress
          value={percentage}
          className={`h-3 ${
            percentage >= 100
              ? "bg-red-100"
              : percentage >= 80
              ? "bg-orange-100"
              : "bg-green-100"
          }`}
        />

        <div className="flex justify-between items-center">
          <div className={`text-sm ${budgetStatus.color}`}>
            {percentage.toFixed(1)}% used
          </div>
          <div
            className={`text-sm font-medium ${
              remaining >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {remaining >= 0
              ? `${remaining.toFixed(2)} left`
              : `${Math.abs(remaining).toFixed(2)} over`}
          </div>
        </div>

        {budgetStatus.status === "over" && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm font-medium">Budget Exceeded</span>
            </div>
            <p className="text-sm text-red-700 mt-1">
              You've exceeded your budget by {Math.abs(remaining).toFixed(2)}.
              Consider reducing spending in this category.
            </p>
          </div>
        )}

        {budgetStatus.status === "warning" && (
          <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-center gap-2 text-orange-800">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm font-medium">Approaching Limit</span>
            </div>
            <p className="text-sm text-orange-700 mt-1">
              You've used {percentage.toFixed(1)}% of your budget. Be mindful of
              remaining spending.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BudgetCard;
