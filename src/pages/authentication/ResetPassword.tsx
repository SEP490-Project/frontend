import { ResetPasswordForm } from "@/components/authentication/ResetPasswordForm";

export const ResetPassword = () => {
  const handleSubmit = (data: { password: string; confirmPassword: string }) => {
    console.log("Reset password data:", data);
  };

  return <ResetPasswordForm onSubmit={handleSubmit} />;
};
