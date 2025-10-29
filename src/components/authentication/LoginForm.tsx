import React from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router";
import { PasswordInput } from "@/components/password-input";
import { useAuth } from "@/libs/hooks/useAuth";
import { Loader2 } from "lucide-react";

interface LoginRequest {
  login_identifier: string;
  password: string;
}

interface LoginFormProps {
  onSubmit: (data: LoginRequest) => void;
}

const LoginSchema = yup.object().shape({
  login_identifier: yup
    .string()
    .required("Email or Username is required")
    .test("is-email-or-username", "Must be a valid email or username", (value) => {
      if (!value) return false;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const usernameRegex = /^[a-zA-Z0-9._-]{3,}$/;
      return emailRegex.test(value) || usernameRegex.test(value);
    })
    .trim(),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required")
    .trim(),
});

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm<LoginRequest>({
    resolver: yupResolver(LoginSchema),
  });
  const { loading } = useAuth();

  return (
    <div className="flex flex-col justify-center items-center gap-10 w-full">
      <div>
        <h2 className="text-2xl font-extrabold text-center">Sign In</h2>
        <p className="text-gray-600 mt-2 text-sm">Welcome back! Please enter your details.</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full">
        <div className="w-full">
          <h5 className="pb-1">Username</h5>
          <Input
            {...register("login_identifier")}
            placeholder="Email or Username"
            className="w-full"
          />
        </div>
        <div className="w-full">
          <h5 className="pb-1">Password</h5>
          <PasswordInput {...register("password")} placeholder="Password" className="w-full" />
          <div className="flex justify-end mt-2 text-sm ">
            <p
              className="text-right cursor-pointer hover:underline text-primary"
              onClick={() => navigate("/forgot-password")}
            >
              Forgot Password?
            </p>
          </div>
        </div>
        <Button
          type="submit"
          className={`mt-4 text-white flex items-center justify-center transition ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
          size="lg"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </Button>
      </form>
      <div className="text-sm text-center mt-4" onClick={() => navigate("/register")}>
        Don't have an account?{" "}
        <span className="text-primary hover:underline cursor-pointer">Sign Up</span>
      </div>
    </div>
  );
};
