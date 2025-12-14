import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { PasswordInput } from "../password-input";
import { Label } from "../ui/label";
import { useAppDispatch } from "@/libs/stores";
import { changePasswordThunk } from "@/libs/stores/authentManager/thunk";
import { getProfileThunk } from "@/libs/stores/userManager/thunk";
import { Button } from "../ui/button";
import { useState } from "react";
import { toast } from "sonner";

const updatePasswordSchema = yup.object({
  current_password: yup.string().required("Current password is required"),
  new_password: yup.string().min(6, "Password must be at least 6 characters"),
  confirm_password: yup.string().oneOf([yup.ref("new_password"), ""], "Passwords must match"),
});

const ChangePasswordForm = () => {
  const dispatch = useAppDispatch();

  const { register: registerPassword, handleSubmit: handleSubmitPassword } = useForm({
    resolver: yupResolver(updatePasswordSchema),
    defaultValues: {
      current_password: "",
      new_password: "",
      confirm_password: "",
    },
  });

  const [isEditing, setIsEditing] = useState(false);

  const onSubmitPassword = async (data: any) => {
    const result = await dispatch(changePasswordThunk(data));
    if (result.meta.requestStatus === "fulfilled") {
      dispatch(getProfileThunk());
    }
    setIsEditing(false);
  };

  const onError = (errors: any) => {
    const firstError = Object.values(errors)[0] as any;
    toast.error(firstError?.message || "Please check the form for errors.");
  };

  return (
    <>
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h4 className=" text-xl font-semibold">Change Password</h4>
          <Button
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? "Cancel" : "Change Password"}
          </Button>
        </div>
        <form onSubmit={handleSubmitPassword(onSubmitPassword, onError)}>
          <div className="mb-4">
            <Label htmlFor="current_password" className="block text-sm font-medium mb-2">
              Current Password
            </Label>
            <PasswordInput
              {...registerPassword("current_password")}
              id="current_password"
              disabled={!isEditing}
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="new_password" className="block text-sm font-medium mb-2">
              New Password
            </Label>
            <PasswordInput
              {...registerPassword("new_password")}
              id="new_password"
              disabled={!isEditing}
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="confirm_password" className="block text-sm font-medium mb-2">
              Confirm Password
            </Label>
            <PasswordInput
              {...registerPassword("confirm_password")}
              id="confirm_password"
              disabled={!isEditing}
            />
          </div>
          <div className="mt-6 flex justify-end">
            <Button type="submit" disabled={!isEditing}>
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ChangePasswordForm;
