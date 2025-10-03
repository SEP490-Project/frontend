import { LoginForm } from "@/components/authentication/LoginForm";
import React from "react";
import { login } from "@/libs/stores/authentManager/thunk";
import { useAppDispatch } from "@/libs/stores";

const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const handleSubmit = async (data: { login_identifier: string; password: string }) => {
    const result = await dispatch(login(data)).unwrap();
    console.log(result);
    console.log("Login data:", data);
  };

  return <LoginForm onSubmit={handleSubmit} />;
};

export default Login;
