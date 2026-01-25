import { useAppDispatch } from "@/libs/stores";
import { getProfileThunk } from "@/libs/stores/userManager/thunk";
import React from "react";
import { useSelector } from "react-redux";
import { InformationForm } from "./ProfileForm";
import ChangePasswordForm from "./ChangePasswordForm";

export const Profile = () => {
  const dispatch = useAppDispatch();
  const userProfile = useSelector((state: any) => state.manageUserProfile.userProfile?.data);
  const loading = useSelector((state: any) => state.manageUserProfile.userProfile?.loading);
  const [isEditing, setIsEditing] = React.useState(false);

  React.useEffect(() => {
    dispatch(getProfileThunk());
  }, [dispatch]);

  if (loading || !userProfile) {
    return (
      <div className="border rounded-lg shadow-md w-full bg-white p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4" />
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-2" />
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
        <div className="h-10 bg-gray-200 rounded w-1/4 mt-6" />
      </div>
    );
  }

  return (
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
  );
};
