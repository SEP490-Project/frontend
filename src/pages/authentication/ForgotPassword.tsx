import { ForgotPasswordForm } from "@/components/authentication/ForgotPasswordForm";
import { useAppDispatch } from "@/libs/stores";
import { forgotPassword } from "@/libs/stores/authentManager/thunk";

export const ForgotPassword = () => {
  const dispatch = useAppDispatch();
  const handleSubmit = (data: { email: string }) => {
    dispatch(
      forgotPassword({
        email: data.email,
        frontend_url: window.location.origin + "/reset-password",
      }),
    );
  };

  return <ForgotPasswordForm onSubmit={handleSubmit} />;
};
