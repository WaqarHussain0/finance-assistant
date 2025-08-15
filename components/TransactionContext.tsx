"use client";
import React, { createContext, useContext, ReactNode } from "react";

interface TransactionContextType {
  categorizeTransaction: (description: string) => string;
}

const TransactionContext = createContext<TransactionContextType | undefined>(
  undefined
);

export const TransactionProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // AI-powered categorization (mock implementation)
  const categorizeTransaction = (description: string): string => {
    const keywords = {
      "Food & Dining": [
        "grocery",
        "restaurant",
        "coffee",
        "lunch",
        "dinner",
        "food",
        "cafe",
      ],
      Transportation: [
        "gas",
        "fuel",
        "uber",
        "taxi",
        "bus",
        "train",
        "parking",
      ],
      "Bills & Utilities": [
        "electric",
        "water",
        "internet",
        "phone",
        "cable",
        "utility",
      ],
      Shopping: [
        "amazon",
        "store",
        "mall",
        "shopping",
        "clothes",
        "electronics",
      ],
      Entertainment: ["movie", "concert", "game", "streaming", "netflix"],
      Healthcare: ["hospital", "doctor", "pharmacy", "medical"],
      Income: ["salary", "wages", "freelance", "bonus"],
    };

    const lowerDescription = description.toLowerCase();

    for (const [category, keywordList] of Object.entries(keywords)) {
      if (keywordList.some((keyword) => lowerDescription.includes(keyword))) {
        return category;
      }
    }

    return "Other";
  };

  return (
    <TransactionContext.Provider
      value={{
        categorizeTransaction,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error(
      "useTransactions must be used within a TransactionProvider"
    );
  }
  return context;
};
