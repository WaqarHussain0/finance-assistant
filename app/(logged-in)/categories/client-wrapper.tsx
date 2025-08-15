"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { Button } from "../../../components/ui/button";
import { Pencil, Trash2, Plus } from "lucide-react";
import { API_ENDPOINT } from "../../../constant/api-endpoint.constant";
import { fetchApiInstance } from "../../../utils/api";
import { useRouter } from "next/navigation";
import CategoryModal from "../../../components/modals/Category.modal";
import { ICategory } from "../../../@types/category";
import { useAuth } from "../../../utils/hooks/useAuth";

interface CategoryClientWrapperProps {
  categories: ICategory[];
}

export default function CategoryClientWrapper({
  categories,
}: CategoryClientWrapperProps) {
  const router = useRouter();
  const { user } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ICategory | null>(
    null
  );

  // CREATE
  const handleCreate = async (data: { name: string }) => {
    try {
      await fetchApiInstance<any>(`${API_ENDPOINT.categories}`, {
        method: "POST",
        body: { name: data.name, userId: user?.id },
      });
    } catch (error) {
      console.error("Error creating category:", error);
    } finally {
      setIsModalOpen(false);
      router.refresh();
    }
  };

  // UPDATE
  const handleUpdate = async (data: { name: string }) => {
    if (!editingCategory) return;
    try {
      await fetchApiInstance<any>(
        `${API_ENDPOINT.categories}/${editingCategory.id}`,
        {
          method: "PUT",
          body: { name: data.name },
        }
      );
    } catch (error) {
      console.error("Error updating category:", error);
    } finally {
      setEditingCategory(null);
      setIsModalOpen(false);
      router.refresh();
    }
  };

  // DELETE
  const handleDelete = async (id: string) => {
    try {
      await fetchApiInstance<any>(`${API_ENDPOINT.categories}/${id}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.error("Error deleting category:", error);
    } finally {
      router.refresh();
    }
  };

  const openCreateModal = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const openEditModal = (category: ICategory) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-4 w-full">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Categories</h2>
        <Button onClick={openCreateModal} className="bg-green-600">
          <Plus className="mr-2 h-4 w-4" /> Add Category
        </Button>
      </div>

      {/* CATEGORY TABLE */}
      <Table className="border !rounded-md">
        <TableHeader>
          <TableRow className="">
            <TableHead className="text-">Name</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={2}
                className="text-center text-muted-foreground"
              >
                No categories found.
              </TableCell>
            </TableRow>
          ) : (
            categories.map((category, index) => (
              <TableRow
                key={category.id}
                className={`${index % 2 === 0 ? "bg-slate-50" : ""}`}
              >
                <TableCell>{category.name}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => openEditModal(category)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={() => handleDelete(category.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* CREATE/EDIT MODAL */}
      <CategoryModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSubmit={editingCategory ? handleUpdate : handleCreate}
        defaultValues={
          editingCategory ? { name: editingCategory.name } : { name: "" }
        }
        title={editingCategory ? "Edit Category" : "Create Category"}
      />
    </div>
  );
}
