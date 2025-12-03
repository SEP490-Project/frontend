import React from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { PasswordInput } from "../password-input";

interface RegisterRequest {
  username: string;
  full_name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface RegisterFormProps {
  onSubmit?: (data: Omit<RegisterRequest, "confirmPassword">) => void | Promise<void>;
}

const RegisterSchema = yup.object().shape({
  username: yup.string().required("Username is required").trim(),
  full_name: yup.string().required("Full name is required").trim(),
  email: yup.string().email("Invalid email").required("Email is required").trim(),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required")
    .trim(),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
});

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit }) => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<RegisterRequest>({
    resolver: yupResolver(RegisterSchema),
    mode: "onSubmit",
  });

  const handleFormSubmit = async (data: RegisterRequest) => {
    if (!onSubmit) return;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword: _confirmPassword, ...submitData } = data;
    await onSubmit(submitData);
  };

  return (
    <div className="flex flex-col justify-center items-center gap-8 w-full">
      <div>
        <h2 className="text-2xl font-extrabold text-center">Sign Up</h2>
        <p className="text-gray-600 mt-2 text-sm">
          Create your account by filling in the details below.
        </p>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-4 w-full">
        <div className="space-y-4">
          <div className="w-full">
            <h5 className="pb-1">Username</h5>
            <Input {...register("username")} placeholder="Enter your username" className="w-full" />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
            )}
          </div>

          <div className="w-full">
            <h5 className="pb-1">Full Name</h5>
            <Input
              {...register("full_name")}
              placeholder="Enter your full name"
              className="w-full"
            />
            {errors.full_name && (
              <p className="text-red-500 text-sm mt-1">{errors.full_name.message}</p>
            )}
          </div>

          <div className="w-full">
            <h5 className="pb-1">Email</h5>
            <Input {...register("email")} placeholder="Enter your email" className="w-full" />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div className="w-full">
            <h5 className="pb-1">Password</h5>
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <PasswordInput {...field} placeholder="Enter your password" className="w-full" />
              )}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          <div className="w-full">
            <h5 className="pb-1">Confirm Password</h5>
            <Controller
              name="confirmPassword"
              control={control}
              render={({ field }) => (
                <PasswordInput {...field} placeholder="Confirm your password" className="w-full" />
              )}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>
        </div>

        <Button type="submit" className="mt-6 text-white" size="lg" disabled={isSubmitting}>
          {isSubmitting ? "Signing Up..." : "Sign Up"}
        </Button>
      </form>

      <div className="text-sm text-center" onClick={() => navigate("/login")}>
        Already have an account?{" "}
        <span className="text-primary hover:underline cursor-pointer">Sign In</span>
      </div>
    </div>
  );
};
