import React, { useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
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
    .min(8, "Password must be at least 8 characters")
    .required("Password is required")
    .trim(),
});

const SalesPwaLogin: React.FC = () => {
  const dispatch = useAppDispatch();
  const { loading } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<LoginRequest>({
    resolver: yupResolver(LoginSchema),
    mode: "onSubmit",
  });

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let startY = 0;

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      startY = e.touches[0].clientY;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;

      const currentY = e.touches[0].clientY;
      const isPullingDown = currentY > startY;

      if (el.scrollTop === 0 && isPullingDown) {
        e.preventDefault();
      }
    };

    el.addEventListener("touchstart", onTouchStart, { passive: false });
    el.addEventListener("touchmove", onTouchMove, { passive: false });

    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
    };
  }, []);

  const onSubmit = async (data: LoginRequest) => {
    try {
      await dispatch(login(data)).unwrap();
      navigate("/sales-app", { replace: true });
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div
      ref={containerRef}
      className="sales-pwa-layout min-h-screen max-h-screen overflow-y-auto flex items-center justify-center bg-gradient-to-b from-white via-white to-pink-50 px-5"
    >
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <img src="/icon.png" alt="Sales App Logo" className="w-16 h-16 object-contain" />

          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight mt-2">Sales App</h1>
          <p className="mt-1 text-xs text-gray-500">Sign in to manage orders</p>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl shadow-lg p-5">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-700">Email or Username</label>
              <Input
                {...register("login_identifier")}
                placeholder="you@example.com or username"
                className="h-10 border-gray-200 focus-visible:ring-[#ff9fb2] focus-visible:border-[#ff9fb2]"
              />
              {errors.login_identifier && (
                <p className="text-xs text-red-500">{errors.login_identifier.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-700">Password</label>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <PasswordInput
                    {...field}
                    placeholder="Enter your password"
                    className="h-10 border-gray-200 focus-visible:ring-[#ff9fb2] focus-visible:border-[#ff9fb2]"
                  />
                )}
              />
              {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
            </div>

            <Button
              type="submit"
              className={`w-full mt-2 h-10 text-sm font-medium rounded-xl text-white flex items-center justify-center ${
                loading || isSubmitting ? "opacity-80 cursor-not-allowed" : ""
              }`}
              style={{ backgroundColor: "#ff9fb2" }}
              disabled={loading || isSubmitting}
            >
              {loading || isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <p className="mt-4 text-[11px] text-gray-400 text-center">
            This portal is for sales staff only. Please contact your administrator if you need an
            account.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SalesPwaLogin;
