import { useAppDispatch } from "@/libs/stores";
import { getProfileThunk } from "@/libs/stores/userManager/thunk";
import React from "react";
import { useSelector } from "react-redux";
import { InformationForm } from "./ProfileForm";

export const Profile = () => {
  const dispatch = useAppDispatch();
  const userProfile = useSelector((state: any) => state.manageUserProfile.userProfile?.data);

  React.useEffect(() => {
    dispatch(getProfileThunk());
  }, [dispatch]);

  return (
    <>
      {/* {loading && <div>Loading...</div>} */}
      {userProfile && (
        <div className="border rounded shadow-md w-full bg-white p-6">
          <InformationForm userProfile={userProfile} />
        </div>
      )}
    </>
  );
};
