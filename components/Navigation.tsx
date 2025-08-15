"use client";

import React, { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import {
  LayoutDashboard,
  Receipt,
  PiggyBank,
  Lightbulb,
  Menu,
  X,
  ArrowUpDown,
  LogOut,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../utils/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { PAGE_LINK } from "../constant/page-link.constant";

interface NavigationProps {}

export const Navigation: React.FC<NavigationProps> = ({}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const { user, logout, isAuthenticated } = useAuth();

  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      linkTo: PAGE_LINK.dashboard,
    },
    {
      id: "transactions",
      label: "Transactions",
      icon: Receipt,
      linkTo: PAGE_LINK.transaction,
    },
    { id: "budget", label: "Budget", icon: PiggyBank, linkTo: "/budget" },
    {
      id: "insights",
      label: "AI Insights",
      icon: Lightbulb,
      linkTo: PAGE_LINK.insights,
    },
    {
      id: "category",
      label: "Category",
      icon: ArrowUpDown,
      linkTo: PAGE_LINK.categories,
    },
  ];

  const NavContent = () => (
    <>
      <div className="p-6 border-b">
        <h1 className="text-xl font-semibold">FinanceAI</h1>
        <p className="text-sm text-muted-foreground">
          Personal Finance Assistant
        </p>
      </div>

      <nav className="p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.linkTo;
          return (
            <Button
              key={item.id}
              variant={isActive ? "default" : "ghost"}
              className="w-full justify-start cursor-pointer"
              onClick={() => {
                setIsMobileMenuOpen(false);
                router.push(item.linkTo);
              }}
            >
              <Icon className="mr-2 h-4 w-4" />
              {item.label}
            </Button>
          );
        })}
      </nav>

      {isAuthenticated && user && (
        <div className="mt-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-start p-2 h-auto"
              >
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarFallback className="text-xs">
                    {user.name?.charAt(0) || user.email?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="text-left">
                  <p className="text-sm font-medium">{user.name || "User"}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </>
  );

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden bg-card border-b p-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold">FinanceAI</h1>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="h-4 w-4" />
          ) : (
            <Menu className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-card border-b">
          <NavContent />
        </div>
      )}

      {/* Desktop Sidebar */}
      <Card className="hidden lg:block w-64 rounded-none border-b-0 border-t-0">
        <NavContent />
      </Card>
    </>
  );
};
