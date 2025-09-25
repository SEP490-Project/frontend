import React from "react";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
interface MockLogin {
  email: string;
  password: string;
}

interface LoginFormProps {
  onSubmit: (data: MockLogin) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
  const {
    register,
    handleSubmit,
    // watch,
    // formState: { errors },
  } = useForm<MockLogin>();

  return (
    <div className="flex flex-col justify-center gap-10 w-full">
      <h2 className="text-2xl font-bold font-[Poppins] text-center">Sign In</h2>
      <div>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full">
          <div className="w-full">
            <h5 className="pb-1 font-[Poppins]">Email</h5>
            <Input {...register("email")} placeholder="Email" className="w-full" />
          </div>
          <div className="w-full">
            <h5 className="pb-1 font-[Poppins]">Password</h5>
            <Input
              {...register("password")}
              type="password"
              placeholder="Password"
              className="w-full"
            />
          </div>
          <Button type="submit" className="mt-4 text-white font-[Poppins]">
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
};
