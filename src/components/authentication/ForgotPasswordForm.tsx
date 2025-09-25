import React from "react";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router";

interface ForgotPasswordRequest {
  email: string;
}

interface ForgotPasswordFormProps {
  onSubmit: (data: ForgotPasswordRequest) => void;
}

const ForgotPasswordSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
});

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onSubmit }) => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordRequest>({
    resolver: yupResolver(ForgotPasswordSchema),
  });

  return (
    <div className="flex flex-col justify-center items-center gap-10 w-full">
      <div className="text-center">
        <h2 className="text-2xl font-extrabold font-[Poppins]">Forgot Password</h2>
        <p className="text-gray-600 font-[Poppins] mt-2 text-sm">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full">
        <div className="w-full">
          <h5 className="pb-1 font-[Poppins]">Email</h5>
          <Input {...register("email")} placeholder="Enter your email" className="w-full" />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>

        <Button type="submit" className="mt-4 text-white font-[Poppins]" size={"lg"}>
          Send Reset Link
        </Button>
      </form>

      <div className="text-sm text-center mt-4 font-[Poppins]" onClick={() => navigate("/login")}>
        Remember your password?{" "}
        <span className="text-primary hover:underline cursor-pointer">Sign In</span>
      </div>
    </div>
  );
};
