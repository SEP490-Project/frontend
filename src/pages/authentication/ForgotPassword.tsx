import { ForgotPasswordForm } from "@/components/authentication/ForgotPasswordForm";

export const ForgotPassword = () => {
  const handleSubmit = (data: { email: string }) => {
    console.log("Forgot password data:", data);
  };

  return <ForgotPasswordForm onSubmit={handleSubmit} />;
};
