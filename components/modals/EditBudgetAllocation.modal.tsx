import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

import { useForm, Controller } from "react-hook-form";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { IBudget } from "../../app/(logged-in)/budget/client-wrapper";
import { fetchApiInstance } from "../../utils/api";
import { API_ENDPOINT } from "../../constant/api-endpoint.constant";

interface IEditBudgetAllocationModalProps {
  setIsEditDialogOpen: (open: boolean) => void;
  budget?: IBudget;
}

interface BudgetFormValues {
  budgetlimit: number;
}

const EditBudgetAllocationModal: React.FC<IEditBudgetAllocationModalProps> = ({
  budget,
  setIsEditDialogOpen,
}) => {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BudgetFormValues>({
    defaultValues: { budgetlimit: budget?.budgetlimit || 0 },
  });

  const onSubmit = async (data: BudgetFormValues) => {
    if (!budget) return;

    try {
      await fetchApiInstance<{ success: boolean; data: any }>(
        `${API_ENDPOINT.budget}/${budget.id}`,
        {
          method: "PUT",
          body: {
            budgetlimit: data.budgetlimit, // new value
          },
        }
      );

      reset();
      setIsEditDialogOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Error updating budget:", error);
    }
  };

  // Keep form in sync if budget changes
  useEffect(() => {
    if (budget) {
      reset({ budgetlimit: budget.budgetlimit ?? 0 });
    }
  }, [budget, reset]);

  return (
    <Dialog
      open={true}
      onOpenChange={(open) => {
        setIsEditDialogOpen(open);
        if (!open) reset();
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Budget: {budget?.categories.name}</DialogTitle>
          <DialogDescription>Update the budget</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="limit" className="mb-2">
              Monthly Budget Limit
            </Label>
            <Controller
              name="budgetlimit"
              control={control}
              rules={{
                required: "Budget limit is required",
                min: { value: 1, message: "Budget limit must be at least 1" },
              }}
              render={({ field }) => (
                <Input
                  id="limit"
                  type="number"
                  min={1}
                  {...field}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value === "" ? "" : Number(e.target.value)
                    )
                  }
                />
              )}
            />
            {errors.budgetlimit && (
              <p className="text-sm text-red-500 mt-1">
                {errors.budgetlimit.message}
              </p>
            )}
          </div>
          <Button type="submit" className="w-full">
            Update Budget
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditBudgetAllocationModal;
