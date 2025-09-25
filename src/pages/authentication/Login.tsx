import { LoginForm } from "@/components/authentication/LoginForm";
import React from "react";

const Login: React.FC = () => {
  const handleSubmit = (data: { email: string; password: string }) => {
    console.log("Login data:", data);
  };

  return <LoginForm onSubmit={handleSubmit} />;
};

export default Login;
