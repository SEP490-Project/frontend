import React from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAppDispatch } from "@/libs/stores";
import { login } from "@/libs/stores/authentManager/thunk";
import { useAuth } from "@/libs/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/password-input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface LoginRequest {
  login_identifier: string;
  password: string;
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

const SalesPwaLogin: React.FC = () => {
  const dispatch = useAppDispatch();
  const { loading } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, formState } = useForm<LoginRequest>({
    resolver: yupResolver(LoginSchema),
  });

  const onSubmit = async (data: LoginRequest) => {
    try {
      await dispatch(login(data)).unwrap();
      // Sau khi login xong, SalesPwaRoute sẽ check role, ở đây cứ đẩy vào /sales-app
      navigate("/sales-app", { replace: true });
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const { errors } = formState;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6 space-y-6">
        <div className="text-center">
          <h1 className="text-xl font-bold">Sales App</h1>
          <p className="text-xs text-gray-500 mt-1">Đăng nhập để quản lý đơn hàng</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Username</label>
            <Input
              {...register("login_identifier")}
              placeholder="Email or Username"
              className="mt-1"
            />
            {errors.login_identifier && (
              <p className="text-xs text-red-500 mt-1">{errors.login_identifier.message}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">Password</label>
            <PasswordInput {...register("password")} placeholder="Password" className="mt-1" />
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className={`w-full mt-2 flex items-center justify-center ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
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
      </div>
    </div>
  );
};

export default SalesPwaLogin;
