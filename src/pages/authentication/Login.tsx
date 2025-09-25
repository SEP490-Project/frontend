import { LoginForm } from "@/components/authentication/LoginForm";
import React from "react";

const Login: React.FC = () => {
  const handleSubmit = (data: { email: string; password: string }) => {
    console.log("Login data:", data);
  };

  return (
    <div className="bg-linear-[90deg,_#FFC7E2,_#FC9DEB] flex items-center justify-center min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 h-[90vh] w-[90%] rounded-2xl shadow-lg overflow-hidden gap-4 bg-white">
        <div className="hidden md:block">
          <img
            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
            alt="Login Image"
            className="w-full h-full object-cover hidden md:block"
          />
        </div>
        <div className="p-8 flex flex-col justify-center min-w-full">
          <LoginForm onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  );
};

export default Login;
