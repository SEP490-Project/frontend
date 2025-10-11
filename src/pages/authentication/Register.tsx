import React from "react";
import { useAppDispatch } from "@/libs/stores";
import { register } from "@/libs/stores/authentManager/thunk";
import { RegisterForm } from "@/components/authentication/RegisterForm";

const Register: React.FC = () => {
  const dispatch = useAppDispatch();
  const handleSubmit = async (data: {
    username: string;
    full_name: string;
    email: string;
    password: string;
  }) => {
    try {
      await dispatch(register(data));
    } catch (error: any) {
      console.error("Registration failed:", error);
    }
  };

  return <RegisterForm onSubmit={handleSubmit} />;
};

export default Register;
