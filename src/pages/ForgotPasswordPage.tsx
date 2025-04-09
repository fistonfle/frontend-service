/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import AuthLayout from "../layouts/AuthLayout";
import toast from "react-hot-toast";
import axiosInstance from "../helpers/axios";

export default function ForgotPasswordPage() {
  const [hasSent, setHasSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [email, setEmail] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await axiosInstance.post("/auth/reset-password" + `?email=${email}`);
      toast.success("Reset link sent successfully");
      setHasSent(true);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    if (name === "email") {
      setEmail(value);
    }
  };

  return (
    <AuthLayout currentRoute="forgot-password">
      <div className="bg-white rounded-lg md:mt-0 w-full sm:max-w-screen-sm xl:p-0">
        <div className="p-6 space-y-8">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
            Reset your password
          </h2>
          <p className="text-gray-600">
            To reset your password, please type in the email address linked to
            your Fam Gold account.
          </p>
          {hasSent ? (
            <p className="text-green-600">
              A reset link has been sent to your email ({email}) . Please check
              your inbox and follow the instructions to reset your password.
            </p>
          ) : (
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-900 block mb-2"
                >
                  Your email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                  placeholder="name@company.com"
                  required
                  value={email}
                  onChange={handleChange}
                />
              </div>
              <button
                type="submit"
                className="text-white bg-[#060270] bg-opacity-90 font-medium rounded-lg text-base px-5 py-3 w-full sm:w-auto text-center"
                disabled={isLoading}
              >
                {isLoading ? "Wait..." : "Send reset link"}
              </button>
            </form>
          )}
        </div>
      </div>
    </AuthLayout>
  );
}
