import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router";
import * as yup from "yup";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { PasswordInput } from "../password-input";

interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  fullName: string;
  dateOfBirth: string;
  address: Address;
}

interface Address {
  type: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

interface RegisterFormProps {
  onSubmit?: (data: RegisterRequest) => void;
}

const RegisterSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
  phone: yup.string().required("Phone number is required"),
  fullName: yup.string().required("Full name is required"),
  dateOfBirth: yup.string().required("Date of birth is required"),
  address: yup.object().shape({
    type: yup.string().required("Address type is required"),
    street: yup.string().required("Street is required"),
    city: yup.string().required("City is required"),
    postalCode: yup.string().required("Postal code is required"),
    country: yup.string().required("Country is required"),
    isDefault: yup.boolean().required(),
  }),
});

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit }) => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterRequest>({
    resolver: yupResolver(RegisterSchema),
    defaultValues: {
      address: {
        type: "home",
        isDefault: true,
      },
    },
  });

  const handleFormSubmit = (data: RegisterRequest) => {
    if (onSubmit) {
      onSubmit(data);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center gap-8 w-full">
      <div>
        <h2 className="text-2xl font-extrabold font-[Poppins] text-center">Sign Up</h2>
        <p className="text-gray-600 font-[Poppins] mt-2 text-sm">
          Create your account by filling in the details below.
        </p>
      </div>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-4 w-full">
        <div className="space-y-4">
          <div className="w-full">
            <h5 className="pb-1 font-[Poppins]">Full Name</h5>
            <Input
              {...register("fullName")}
              placeholder="Enter your full name"
              className="w-full"
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
            )}
          </div>

          <div className="w-full">
            <h5 className="pb-1 font-[Poppins]">Email</h5>
            <Input {...register("email")} placeholder="Enter your email" className="w-full" />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="w-full">
              <h5 className="pb-1 font-[Poppins]">Phone Number</h5>
              <Input
                {...register("phone")}
                placeholder="Enter your phone number"
                className="w-full"
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
            </div>

            <div className="w-full">
              <h5 className="pb-1 font-[Poppins]">Date of Birth</h5>
              <Input {...register("dateOfBirth")} type="date" className="w-full" />
              {errors.dateOfBirth && (
                <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth.message}</p>
              )}
            </div>
          </div>

          <div className="w-full">
            <h5 className="pb-1 font-[Poppins]">Password</h5>
            <PasswordInput
              {...register("password")}
              placeholder="Enter your password"
              className="w-full"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          <div className="w-full">
            <h5 className="pb-1 font-[Poppins]">Confirm Password</h5>
            <PasswordInput
              {...register("confirmPassword")}
              placeholder="Confirm your password"
              className="w-full"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>
        </div>

        <Button type="submit" className="mt-6 text-white font-[Poppins]" size="lg">
          Sign Up
        </Button>
      </form>

      <div className="text-sm text-center font-[Poppins]" onClick={() => navigate("/login")}>
        Already have an account?{" "}
        <span className="text-primary hover:underline cursor-pointer">Sign In</span>
      </div>
    </div>
  );
};
