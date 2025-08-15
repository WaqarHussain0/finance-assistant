"use client";

import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { PAGE_LINK } from "../../../constant/page-link.constant";
import { supabase } from "../../../utils/supabaseClient";

type SignInFormData = {
  email: string;
  password: string;
};

export default function SignIn() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (status === "authenticated" && session) {
      router.push("/");
    }
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <Card className="w-full h-[20vh] max-w-md shadow border-[1px] backdrop-blur-md bg-white/80 flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </Card>
    );
  }

  if (status === "authenticated") return null;

  const onSubmit = async (data: SignInFormData) => {
    try {
      // Try login with Supabase
      const { data: supaData, error: supaError } =
        await supabase.auth.signInWithPassword({
          email: data.email.trim(),
          password: data.password,
        });

      console.log({ supaError });

      // If email is not confirmed
      if (supaError?.code === "email_not_confirmed") {
        // Resend verification email
        const { error: resendError } = await supabase.auth.resend({
          type: "signup",
          email: data.email.trim(),
        });

        if (resendError) {
          toast.error("Email verification failed to send", {
            description: resendError.message,
          });
        } else {
          toast.info("Please verify your email", {
            description: "We've sent you a new confirmation link.",
          });
        }
        return;
      }

      // Other login errors
      if (supaError || !supaData.session?.access_token) {
        toast.error("Login failed", {
          description: supaError?.message || "Invalid email or password",
        });
        return;
      }

      // Pass Supabase JWT to NextAuth
      const result = await signIn("credentials", {
        access_token: supaData.session.access_token,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Login failed", {
          description: result.error,
        });
      } else if (result?.ok) {
        toast.success("Welcome back! 🎉", {
          description: "Redirecting to your dashboard...",
        });
        router.push("/");
      }
    } catch (err) {
      console.error(err);
      toast.error("Login failed", {
        description: "An unexpected error occurred",
      });
    }
  };

  return (
    <Card className="w-full max-w-md shadow-xl border-[1px] backdrop-blur-md bg-white/80">
      <CardHeader className="space-y-2">
        <CardTitle className="text-3xl font-bold text-center text-emerald-700">
          Welcome Back
        </CardTitle>
        <CardDescription className="text-center text-gray-500">
          Sign in to track your expenses, budgets, and financial goals.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Controller
              name="email"
              control={control}
              rules={{
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Please enter a valid email address",
                },
              }}
              render={({ field }) => (
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  {...field}
                  className={`h-11 ${errors.email ? "border-red-500" : ""}`}
                  disabled={isSubmitting}
                />
              )}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Controller
                name="password"
                control={control}
                rules={{
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                }}
                render={({ field }) => (
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...field}
                    className={`h-11 pr-10 ${
                      errors.password ? "border-red-500" : ""
                    }`}
                    disabled={isSubmitting}
                  />
                )}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isSubmitting}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          {/* Submit */}
          <Button
            type="submit"
            className="w-full h-11 bg-emerald-600 hover:bg-emerald-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </Button>

          <div className="text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            <Link
              href={PAGE_LINK.signup}
              className="font-medium text-emerald-600 hover:text-emerald-500"
            >
              Sign up
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
