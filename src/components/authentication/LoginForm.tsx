import React from "react";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router";
import { PasswordInput } from "../password-input";
interface MockLogin {
  email: string;
  password: string;
}

interface LoginFormProps {
  onSubmit: (data: MockLogin) => void;
}

const LoginSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    // watch,
    // formState: { errors },
  } = useForm<MockLogin>({
    resolver: yupResolver(LoginSchema),
  });

  return (
    <div className="flex flex-col justify-center items-center gap-10 w-full">
      <div>
        <h2 className="text-2xl font-extrabold font-[Poppins] text-center">Sign In</h2>
        <p className="text-gray-600 font-[Poppins] mt-2 text-sm">
          Welcome back! Please enter your details.
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full">
        <div className="w-full">
          <h5 className="pb-1 font-[Poppins]">Email</h5>
          <Input {...register("email")} placeholder="Email" className="w-full" />
        </div>
        <div className="w-full">
          <h5 className="pb-1 font-[Poppins]">Password</h5>
          <PasswordInput {...register("password")} placeholder="Password" className="w-full" />
          <div className="flex justify-end mt-2 text-sm ">
            <p
              className="text-right cursor-pointer font-[Poppins] hover:underline text-primary"
              onClick={() => navigate("/forgot-password")}
            >
              Forgot Password?
            </p>
          </div>
        </div>
        <Button type="submit" className="mt-4 text-white font-[Poppins]" size={"lg"}>
          Sign In
        </Button>
      </form>
      <div
        className="text-sm text-center mt-4 font-[Poppins]"
        onClick={() => navigate("/register")}
      >
        Don't have an account?{" "}
        <span className="text-primary hover:underline cursor-pointer">Sign Up</span>
      </div>
    </div>
  );
};
