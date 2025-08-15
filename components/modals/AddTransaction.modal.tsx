import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useTransactions } from "../TransactionContext";
import { useForm, Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchApiInstance } from "../../utils/api";
import { ICategory } from "../../@types/category";
import { API_ENDPOINT } from "../../constant/api-endpoint.constant";
import { useAuth } from "../../utils/hooks/useAuth";

interface IAddTransactionModalProps {
  setIsAddDialogOpen: (open: boolean) => void;
}

interface TransactionFormData {
  amount: number;
  description: string;
  category: { name: string; id: number | null };
  transactiondate: string;
  paymentMethod: "cash" | "card";
  type: "income" | "expense";
}

const AddTransactionModal: React.FC<IAddTransactionModalProps> = ({
  setIsAddDialogOpen,
}) => {
  const router = useRouter();
  const { user } = useAuth();
  const [categories, setCategories] = useState<any[]>([]);

  const { categorizeTransaction } = useTransactions();

  const {
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<TransactionFormData>({
    defaultValues: {
      amount: "" as unknown as number,
      description: "",
      category: { name: "", id: null },
      transactiondate: "",
      type: undefined,
      paymentMethod: "cash",
    },
  });

  const descriptionValue = watch("description");
  const categoryValue = watch("category");

  const onSubmit = async (data: TransactionFormData) => {
    try {
      await fetchApiInstance<{ success: boolean; data: any }>(
        `${API_ENDPOINT.transactions}`,
        {
          method: "POST",
          body: {
            amount: data.type === "expense" ? -data.amount : data.amount,
            description: data.description,
            transactiondate: data.transactiondate,
            type: data.type,
            categoryId: data.category.id,
            userId: user?.id,
          },
        }
      );

      reset();
      setIsAddDialogOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Error submitting transaction:", error);
    }
  };

  // Auto-suggest category
  useEffect(() => {
    if (descriptionValue && !categoryValue?.id) {
      const suggested = categorizeTransaction(descriptionValue); // suggested: string
      if (suggested && categoryValue?.name !== suggested) {
        const matchedCategory = categories.find(
          (cat) => cat.name.toLowerCase() === suggested.toLowerCase()
        );
        if (matchedCategory) {
          setValue(
            "category",
            { id: matchedCategory.id, name: matchedCategory.name },
            { shouldValidate: true }
          );
        }
      }
    }
  }, [
    descriptionValue,
    categoryValue,
    setValue,
    categorizeTransaction,
    categories,
  ]);

  // Fetch categories from Supabase
  const fetchCategories = async () => {
    const categories = await fetchApiInstance<ICategory[]>(
      API_ENDPOINT.categories
    );
    setCategories(categories || []);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="flex gap-2">
      <Dialog open onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Transaction</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Type */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type" className="mb-2">
                  Type
                </Label>
                <Controller
                  name="type"
                  control={control}
                  rules={{ required: "Type is required" }}
                  render={({ field }) => (
                    <Select
                      value={field.value || ""}
                      onValueChange={(value) => field.onChange(value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="expense">Expense</SelectItem>
                        <SelectItem value="income">Income</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.type && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.type.message}
                  </p>
                )}
              </div>

              {/* Amount */}
              <div>
                <Label htmlFor="amount" className="mb-2">
                  Amount
                </Label>
                <Controller
                  name="amount"
                  control={control}
                  rules={{
                    required: "Amount is required",
                    min: { value: 1, message: "Amount must be at least 1" },
                    validate: (value) =>
                      !isNaN(value) || "Amount must be a number",
                  }}
                  render={({ field }) => (
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={field.value || ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === ""
                            ? ""
                            : parseFloat(e.target.value)
                        )
                      }
                    />
                  )}
                />
                {errors.amount && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.amount.message}
                  </p>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description" className="mb-2">
                Description
              </Label>
              <Controller
                name="description"
                control={control}
                rules={{ required: "Description is required" }}
                render={({ field }) => (
                  <Input
                    id="description"
                    placeholder="Enter description..."
                    value={field.value || ""}
                    onChange={field.onChange}
                  />
                )}
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Category */}
            <div>
              <Label htmlFor="category" className="mb-2">
                Category
              </Label>
              <Controller
                name="category"
                control={control}
                rules={{ required: "Category is required" }}
                render={({ field }) => (
                  <Select
                    value={field.value?.id ? String(field.value.id) : ""}
                    onValueChange={(value) => {
                      const selectedCategory = categories.find(
                        (cat) => String(cat.id) === value
                      );
                      if (selectedCategory) {
                        field.onChange({
                          id: selectedCategory.id,
                          name: selectedCategory.name,
                        });
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category..." />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem
                          key={category.id}
                          value={String(category.id)}
                        >
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.category && (
                <p className="text-red-500 text-sm">
                  {errors.category.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Paid Via  */}
              <div className="">
                <div>
                  <Label htmlFor="paymentMethod" className="mb-2">
                    Paid Via
                  </Label>
                  <Controller
                    name="paymentMethod"
                    control={control}
                    // rules={{ required: "paymentMethod is required" }}
                    render={({ field }) => (
                      <Select
                        value={field.value || ""}
                        onValueChange={(value) => field.onChange(value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cash">By Cash</SelectItem>
                          <SelectItem value="card">By Card</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.paymentMethod && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.paymentMethod.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Date */}
              <div>
                <Label htmlFor="date" className="mb-2">
                  Date
                </Label>
                <Controller
                  name="transactiondate"
                  control={control}
                  rules={{
                    required: "Date is required",
                    validate: (val) => !!val || "Date is required",
                  }}
                  render={({ field }) => (
                    <Input
                      id="date"
                      type="date"
                      value={field.value || ""}
                      onChange={field.onChange}
                    />
                  )}
                />
                {errors.transactiondate && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.transactiondate.message}
                  </p>
                )}
              </div>
            </div>

            <Button type="submit" className="w-full mt-2">
              Add Transaction
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddTransactionModal;
