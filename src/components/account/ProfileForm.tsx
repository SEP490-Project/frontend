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
import { PasswordInput } from "../password-input";

const updateProfileSchema = yup.object({
  full_name: yup.string().required("Full name is required"),
  phone: yup.string().required("Phone number is required"),
  email: yup.string(),
  username: yup.string().required("Username is required"),
  date_of_birth: yup.date().nullable().required("Date of birth is required"),
  password: yup.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: yup.string().oneOf([yup.ref("password"), ""], "Passwords must match"),
});

export const InformationForm = ({ userProfile }: { userProfile: UserData }) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [dateOfBirth, setDateOfBirth] = React.useState<Date | undefined>(
    userProfile?.date_of_birth ? new Date(userProfile.date_of_birth) : undefined,
  );

  const { register, handleSubmit } = useForm({
    resolver: yupResolver(updateProfileSchema),
    defaultValues: {
      full_name: userProfile?.full_name || "",
      phone: userProfile?.phone || "",
      email: userProfile?.email || "",
      username: userProfile?.username || "",
      date_of_birth: dateOfBirth ? dateOfBirth : undefined,
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: any) => {
    data.date_of_birth = dateOfBirth;
    console.log(data);
    // Handle form submission, e.g., send data to the server
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="flex flex-col items-center md:border-r">
        <div className="flex flex-col items-center">
          {userProfile?.avatar ? (
            <img
              src={userProfile?.avatar}
              alt={`${userProfile.full_name}'s avatar`}
              className="w-36 h-36 rounded-full"
            />
          ) : (
            <div className="w-36 h-36 rounded-full bg-gray-300 flex items-center justify-center">
              <p className="text-gray-600 text-[3em]">{defaultAvatarByName("Tran Khai")}</p>
            </div>
          )}
          <div className="mt-4 flex flex-col items-center justify-center gap-4">
            <Button variant="outline" className="relative overflow-hidden">
              Change Avatar
              <Input type="file" className="opacity-0 absolute inset-0" />
            </Button>
            <Button variant="default" onClick={() => setIsEditing(!isEditing)}>
              {isEditing ? "Cancel" : "Edit Profile"}
            </Button>
          </div>
        </div>
      </div>
      <div className="md:col-span-2">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-6">
            <h4 className="mb-4 text-xl font-semibold">Personal Information</h4>
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
                    disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                    autoFocus
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
              {isEditing && (
                <>
                  <div className="mb-4">
                    <Label htmlFor="password" className="block text-sm font-medium mb-2">
                      New Password
                    </Label>
                    <PasswordInput {...register("password")} id="password" />
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                      Confirm Password
                    </Label>
                    <PasswordInput {...register("confirmPassword")} id="confirmPassword" />
                  </div>
                  <div className="mt-6 flex justify-end">
                    <Button type="submit">Save Changes</Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
