import { LoginForm } from "@/components/authentication/LoginForm";
import React from "react";
import { login } from "@/libs/stores/authentManager/thunk";
import { useAppDispatch } from "@/libs/stores";
import { toast } from "sonner";

const Login: React.FC = () => {
  const dispatch = useAppDispatch();

  const handleSubmit = async (data: { login_identifier: string; password: string }) => {
    try {
      await dispatch(login(data)).unwrap();
      toast.success("Login successful!");
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Login failed. Please check your credentials and try again.");
    }
  };

  return <LoginForm onSubmit={handleSubmit} />;
};

export default Login;
