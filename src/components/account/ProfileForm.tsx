import { defaultAvatarByName } from "@/libs/helper/default-avatar";
import type { UserData } from "@/libs/types/user";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import React from "react";
import { Label } from "../ui/label";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/libs/utils";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAppDispatch } from "@/libs/stores";
import { getProfileThunk, updateProfileThunk } from "@/libs/stores/userManager/thunk";
import { toast } from "sonner";
import { uploadFilesThunk } from "@/libs/stores/fileManager/thunk";

const updateProfileSchema = yup.object({
  full_name: yup.string(),
  phone: yup.string(),
  email: yup.string(),
  username: yup.string(),
  date_of_birth: yup.date().nullable(),
});

export const InformationForm = ({
  userProfile,
  isEditing,
  setIsEditing,
}: {
  userProfile: UserData;
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const dispatch = useAppDispatch();

  const [dateOfBirth, setDateOfBirth] = React.useState<Date | undefined>(
    userProfile.date_of_birth ? new Date(userProfile.date_of_birth) : undefined,
  );
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);

  const currentDate = new Date();

  const { register, handleSubmit } = useForm({
    resolver: yupResolver(updateProfileSchema),
    defaultValues: {
      full_name: userProfile?.full_name || "",
      phone: userProfile?.phone || "",
      email: userProfile?.email || "",
      username: userProfile?.username || "",
      date_of_birth: userProfile.date_of_birth ? new Date(userProfile.date_of_birth) : undefined,
    },
  });

  const onSubmit = async (data: any) => {
    if (dateOfBirth) {
      const dob = new Date(dateOfBirth);
      const years = currentDate.getFullYear() - dob.getFullYear();
      if (years < 18) {
        toast.error("You must be at least 18 years old.");
        return;
      }
      data.date_of_birth = dob.toISOString();
    }
    const result = await dispatch(updateProfileThunk(data));
    if (result.meta.requestStatus === "fulfilled") {
      toast.success("Profile updated successfully");
      setIsEditing(false);
      dispatch(getProfileThunk());
    } else {
      toast.error("Failed to update profile");
    }
  };

  const onError = (errors: any) => {
    const firstError = Object.values(errors)[0] as any;
    toast.error(firstError?.message || "Please check the form for errors.");
  };

  const handleChangeAvatar = async () => {
    if (!imageFile) {
      toast.error("No image selected");
      return;
    }

    try {
      const result = await dispatch(
        uploadFilesThunk({ userId: userProfile.id, files: [imageFile] }),
      ).unwrap();

      const avatarUrl = result[0] as unknown as string;
      const updateResult = await dispatch(updateProfileThunk({ avatar_url: avatarUrl }));

      if (updateResult.meta.requestStatus === "fulfilled") {
        toast.success("Avatar updated successfully");
        setImagePreview(null);
        setImageFile(null);
        dispatch(getProfileThunk());
      } else {
        toast.error("Failed to update avatar");
      }
    } catch (error) {
      toast.error("Failed to upload avatar");
      console.error("Avatar upload error:", error);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex flex-col items-center md:border-r">
          <div className="flex flex-col items-center">
            {userProfile?.avatar_url || imagePreview ? (
              <img
                src={(imagePreview || userProfile?.avatar_url) as string}
                alt={`${userProfile.full_name}'s avatar`}
                className="w-36 h-36 rounded-full"
              />
            ) : (
              <div className="w-36 h-36 rounded-full bg-gray-300 flex items-center justify-center">
                <p className="text-gray-600 text-[3em]">
                  {defaultAvatarByName(userProfile.full_name)}
                </p>
              </div>
            )}
            <div className="mt-4 flex flex-col items-center justify-center gap-4">
              {imagePreview ? (
                <>
                  <Button
                    variant="default"
                    className="relative overflow-hidden"
                    onClick={handleChangeAvatar}
                  >
                    Confirm Change
                  </Button>
                  <Button
                    variant="outline"
                    className="relative overflow-hidden"
                    onClick={() => {
                      setImagePreview(null);
                      setImageFile(null);
                    }}
                  >
                    Cancel Change
                  </Button>
                </>
              ) : (
                <Button variant="outline" className="relative overflow-hidden">
                  Change Avatar
                  <input
                    type="file"
                    className="opacity-0 absolute inset-0"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setImageFile(file);
                        setImagePreview(URL.createObjectURL(file));
                      }
                    }}
                  />
                </Button>
              )}
            </div>
          </div>
        </div>
        <div className="md:col-span-2">
          <div className="flex mb-4 items-center justify-between">
            <h4 className="text-xl font-semibold">Personal Information</h4>
            <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
              {isEditing ? "Cancel" : "Edit Profile"}
            </Button>
          </div>
          <form onSubmit={handleSubmit(onSubmit, onError)}>
            <div className="space-y-6">
              <div className="mb-4">
                <Label htmlFor="fullName" className="block text-sm font-medium mb-2">
                  Full Name
                </Label>
                <Input
                  {...register("full_name")}
                  defaultValue={userProfile?.full_name}
                  type="text"
                  disabled={!isEditing}
                  id="fullName"
                />
              </div>
              <div className="mb-4">
                <Label htmlFor="phone" className="block text-sm font-medium mb-2">
                  Phone
                </Label>
                <Input
                  {...register("phone")}
                  defaultValue={userProfile?.phone}
                  type="text"
                  disabled={!isEditing}
                  id="phone"
                />
              </div>
              <div>
                <Label htmlFor="dateOfBirth" className="block text-sm font-medium mb-2">
                  Date of Birth
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      disabled={!isEditing}
                      className={cn(
                        "w-full justify-start text-left font-normal border border-input hover:bg-transparent",
                        !dateOfBirth && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateOfBirth ? format(dateOfBirth, "dd/MM/yyyy") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateOfBirth}
                      onSelect={setDateOfBirth}
                      {...register("date_of_birth")}
                      disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                      autoFocus
                      captionLayout="dropdown"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <h4 className="mb-4 text-xl font-semibold">Account Information</h4>
                <div className="mb-4">
                  <Label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email
                  </Label>
                  <Input
                    {...register("email")}
                    defaultValue={userProfile?.email}
                    type="email"
                    disabled={true}
                    id="email"
                  />
                </div>
                <div className="mb-4">
                  <Label htmlFor="username" className="block text-sm font-medium mb-2">
                    Username
                  </Label>
                  <Input
                    {...register("username")}
                    defaultValue={userProfile?.username}
                    type="text"
                    disabled={!isEditing}
                    id="username"
                  />
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <Button type="submit" disabled={!isEditing}>
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
