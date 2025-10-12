import { useAppDispatch } from "@/libs/stores";
import { getProfileThunk } from "@/libs/stores/userManager/thunk";
import React from "react";
import { useSelector } from "react-redux";
import { InformationForm } from "./ProfileForm";

export const Profile = () => {
  const dispatch = useAppDispatch();
  const userProfile = useSelector((state: any) => state.manageUser.userProfile?.data);
  // const loading = useSelector((state: any) => state.manageUser.loading);

  React.useEffect(() => {
    dispatch(getProfileThunk());
  }, [dispatch]);

  console.log("User Profile:", userProfile);
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
