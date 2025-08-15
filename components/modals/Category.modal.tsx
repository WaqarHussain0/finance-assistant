"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { DialogDescription } from "@radix-ui/react-dialog";

interface CategoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { name: string }) => void;
  defaultValues?: { name: string };
  title: string;
}

export default function CategoryModal({
  open,
  onOpenChange,
  onSubmit,
  defaultValues = { name: "" },
  title,
}: CategoryModalProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<{ name: string }>({
    defaultValues,
  });

  React.useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>Categories</DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit((data) => {
            onSubmit(data);
          })}
          className="space-y-4"
        >
          <Controller
            name="name"
            control={control}
            rules={{ required: "Category name is required" }}
            render={({ field }) => (
              <div>
                <Input placeholder="Category name" {...field} />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>
            )}
          />

          <Button type="submit" className="w-full">
            {title}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
