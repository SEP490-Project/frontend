import { ResetPasswordForm } from "@/components/authentication/ResetPasswordForm";
import { useAppDispatch } from "@/libs/stores";
import { resetPassword } from "@/libs/stores/authentManager/thunk";
import { useNavigate } from "react-router";

export const ResetPassword = () => {
  const dispatch = useAppDispatch();
  const nav = useNavigate();
  const handleSubmit = async (data: { password: string; confirmPassword: string }) => {
    const result = await dispatch(
      resetPassword({
        token: new URLSearchParams(window.location.search).get("state") || "",
        email: new URLSearchParams(window.location.search).get("email") || "",
        new_password: data.password,
      }),
    );

    if (resetPassword.fulfilled.match(result)) {
      nav("/login");
    }
  };

  return <ResetPasswordForm onSubmit={handleSubmit} />;
};
