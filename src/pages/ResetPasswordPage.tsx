/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import AuthLayout from "../layouts/AuthLayout";
import toast from "react-hot-toast";
import axiosInstance from "../helpers/axios";
import { useNavigate } from "react-router-dom";

export default function ResetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // get the token from the url
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }
    try {
      setIsLoading(true);
      await axiosInstance.post("/auth/change-password", {
        newPassword: password,
        token,
      });
      toast.success("Password reset successfully");
      navigation("/login");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    if (name === "password") {
      setPassword(value);
    } else if (name === "confirmPassword") {
      setConfirmPassword(value);
    }
  };

  useEffect(() => {
    if (!token) {
      navigation("/forgot-password");
    }
  }, [token, navigation]);

  return (
    <AuthLayout currentRoute="reset-password">
      <div className="bg-white rounded-lg md:mt-0 w-full sm:max-w-screen-sm xl:p-0">
        <div className="p-6 space-y-8">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
            Set a new password
          </h2>
          <p className="text-gray-600">
            To reset your password, please type in a new password and confirm
            the password.
          </p>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-900 block mb-2"
              >
                Your password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                placeholder="********"
                required
                value={password}
                onChange={handleChange}
              />
            </div>
            <div>
              <label
                htmlFor="confirmPassword"
                className="text-sm font-medium text-gray-900 block mb-2"
              >
                Confirm password
              </label>
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                placeholder="********"
                required
                value={confirmPassword}
                onChange={handleChange}
              />
            </div>
            <button
              type="submit"
              className="text-white bg-[#060270] bg-opacity-90 font-medium rounded-lg text-base px-5 py-3 w-full sm:w-auto text-center"
              disabled={isLoading}
            >
              {isLoading ? "Wait..." : "Reset password"}
            </button>
          </form>
        </div>
      </div>
    </AuthLayout>
  );
}
