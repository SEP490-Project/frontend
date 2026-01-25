import React from "react";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";

interface ForgotPasswordRequest {
  email: string;
}

interface ForgotPasswordFormProps {
  onSubmit: (data: ForgotPasswordRequest) => void | Promise<void>;
}

const ForgotPasswordSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required").trim(),
});

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onSubmit }) => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordRequest>({
    resolver: yupResolver(ForgotPasswordSchema),
    mode: "onSubmit",
  });

  return (
    <div className="flex flex-col justify-center items-center gap-10 w-full">
      <div className="text-center">
        <h2 className="text-2xl font-extrabold">Forgot Password</h2>
        <p className="text-gray-600 mt-2 text-sm">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full">
        <div className="w-full">
          <h5 className="pb-1">Email</h5>
          <Input {...register("email")} placeholder="Enter your email" className="w-full" />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>

        <Button type="submit" className="mt-4 text-white" size="lg" disabled={isSubmitting}>
          {isSubmitting ? "Sending..." : "Send Reset Link"}
        </Button>
      </form>

      <div className="text-sm text-center mt-4" onClick={() => navigate("/login")}>
        Remember your password?{" "}
        <span className="text-primary hover:underline cursor-pointer">Sign In</span>
      </div>
    </div>
  );
};
