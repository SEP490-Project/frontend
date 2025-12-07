import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "../ui/button";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { PasswordInput } from "../password-input";

interface ResetPasswordRequest {
  password: string;
  confirmPassword: string;
}

interface ResetPasswordFormProps {
  onSubmit: (data: ResetPasswordRequest) => void | Promise<void>;
}

const ResetPasswordSchema = yup.object().shape({
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
});

export const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ onSubmit }) => {
  const navigate = useNavigate();

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordRequest>({
    resolver: yupResolver(ResetPasswordSchema),
    mode: "onSubmit",
  });

  return (
    <div className="flex flex-col justify-center items-center gap-10 w-full">
      <div className="text-center">
        <h2 className="text-2xl font-extrabold">Reset Password</h2>
        <p className="text-gray-600 mt-2 text-sm">
          Enter your new password below to reset your account password.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full">
        <div className="w-full">
          <h5 className="pb-1">New Password</h5>
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <PasswordInput {...field} placeholder="Enter your new password" className="w-full" />
            )}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>

        <div className="w-full">
          <h5 className="pb-1">Confirm New Password</h5>
          <Controller
            name="confirmPassword"
            control={control}
            render={({ field }) => (
              <PasswordInput
                {...field}
                placeholder="Confirm your new password"
                className="w-full"
              />
            )}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
          )}
        </div>

        <Button type="submit" className="mt-4 text-white" size="lg" disabled={isSubmitting}>
          {isSubmitting ? "Resetting..." : "Reset Password"}
        </Button>
      </form>

      <div className="text-sm text-center mt-4" onClick={() => navigate("/login")}>
        Remember your password?{" "}
        <span className="text-primary hover:underline cursor-pointer">Sign In</span>
      </div>
    </div>
  );
};
