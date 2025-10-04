import { LoginForm } from "@/components/authentication/LoginForm";
import React from "react";
import { login } from "@/libs/stores/authentManager/thunk";
import { useAppDispatch } from "@/libs/stores";

const Login: React.FC = () => {
  const dispatch = useAppDispatch();

  const handleSubmit = async (data: { login_identifier: string; password: string }) => {
    try {
      await dispatch(login(data)).unwrap();
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return <LoginForm onSubmit={handleSubmit} />;
};

export default Login;
