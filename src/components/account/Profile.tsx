import { useAppDispatch } from "@/libs/stores";
import { getProfileThunk } from "@/libs/stores/userManager/thunk";
import React from "react";
import { useSelector } from "react-redux";
import { InformationForm } from "./ProfileForm";
import ChangePasswordForm from "./ChangePasswordForm";

export const Profile = () => {
  const dispatch = useAppDispatch();

  const userProfile = useSelector((state: any) => state.manageUserProfile.userProfile?.data);

  const [isEditing, setIsEditing] = React.useState(false);

  React.useEffect(() => {
    dispatch(getProfileThunk());
  }, [dispatch]);

  return (
    <>
      {/* {loading && <div>Loading...</div>} */}
      {userProfile && (
        <>
          <div className="border rounded-lg shadow-md w-full bg-white p-6">
            <InformationForm
              userProfile={userProfile}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
            />
          </div>
          <div className="border rounded-lg shadow-md w-full bg-white p-6 mt-4">
            <ChangePasswordForm />
          </div>
        </>
      )}
    </>
  );
};
