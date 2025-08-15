"use client";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Badge } from "../../../components/ui/badge";
import { Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import AddTransactionModal from "../../../components/modals/AddTransaction.modal";
import { ICategory } from "../../../@types/category";
import { fetchApiInstance } from "../../../utils/api";
import { API_ENDPOINT } from "../../../constant/api-endpoint.constant";
import { formatDate } from "../../../utils/helper";

export interface ITransaction {
  id: string;
  amount: number;
  description: string;
  categories: { id: number; name: string };
  transactiondate: string;
  type: "income" | "expense";
  paymentMethod: "cash" | "card";
}

interface ITransactionClientWrapperProps {
  transactions: ITransaction[];
  categories: ICategory[];
}

const TransactionClientWrapper: React.FC<ITransactionClientWrapperProps> = ({
  transactions,
  categories,
}) => {
  const router = useRouter();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);
  const [filterCategory, setFilterCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesCategory =
      filterCategory === "all" ||
      transaction.categories.name === filterCategory;

    const matchesSearch =
      transaction.description
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      transaction.categories.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      "Food & Dining": "bg-orange-100 text-orange-800",
      Transportation: "bg-blue-100 text-blue-800",
      "Bills & Utilities": "bg-red-100 text-red-800",
      Shopping: "bg-purple-100 text-purple-800",
      Entertainment: "bg-pink-100 text-pink-800",
      Healthcare: "bg-green-100 text-green-800",
      Income: "bg-emerald-100 text-emerald-800",
      Other: "bg-gray-100 text-gray-800",
    };
    return colors[category] || colors["Other"];
  };

  const deleteTransaction = async (id: string) => {
    try {
      await fetchApiInstance<{ success: boolean }>(
        `${API_ENDPOINT.transactions}/${id}`,
        {
          method: "DELETE",
        }
      );

      router.refresh();
    } catch (error) {
      console.error(`Error deleting transaction with ID ${id}:`, error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex w-full justify-between items-center">
          <div>
            <h2 className="text-2xl font-semibold mb-2">Transactions</h2>
            <p className="text-muted-foreground">
              Manage your income and expenses
            </p>
          </div>

          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Transaction
          </Button>
        </div>

        {isAddDialogOpen && (
          <AddTransactionModal setIsAddDialogOpen={setIsAddDialogOpen} />
        )}
      </div>
      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="min-w-48">
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories?.map((category) => (
                    <SelectItem key={category?.name} value={category?.name}>
                      {category?.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Transactions List */}
      <Card>
        <CardHeader>
          <CardTitle>
            Recent Transactions ({filteredTransactions.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No data found.
              </div>
            ) : (
              filteredTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="font-medium">
                        {transaction.description}
                      </div>
                      <Badge
                        className={getCategoryColor(
                          transaction?.categories?.name
                        )}
                      >
                        {transaction?.categories?.name}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formatDate(transaction?.transactiondate)}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div
                      className={`font-semibold ${
                        transaction.type === "income"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {transaction.type === "income" ? "+" : ""}
                      {Math.abs(transaction.amount).toFixed(2)}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteTransaction(transaction.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionClientWrapper;
