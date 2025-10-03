import React from "react";
import { useAppDispatch } from "@/libs/stores";
import { register } from "@/libs/stores/authentManager/thunk";
import { RegisterForm } from "@/components/authentication/RegisterForm";

const Register: React.FC = () => {
  const dispatch = useAppDispatch();
  const handleSubmit = async (data: {
    username: string;
    fullName: string;
    email: string;
    password: string;
  }) => {
    console.log("Register data:", data);
    await dispatch(register(data));
  };

  return <RegisterForm onSubmit={handleSubmit} />;
};

export default Register;
