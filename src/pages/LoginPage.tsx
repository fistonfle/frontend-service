/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import AuthLayout from "../layouts/AuthLayout";

export default function LoginPage() {
  const navigate = useNavigate();

  const { handleLogin, isLoggedIn, isLoading } = useContext(AppContext) || {};

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: any) => {
    e.preventDefault();
    handleLogin?.({ email, password });
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/dashboard/");
    }
  }, [isLoggedIn]);

  return (
    <AuthLayout currentRoute="login">
      <div className="bg-white rounded-lg md:mt-0 w-full sm:max-w-screen-sm xl:p-0">
        <div className="p-6 space-y-8">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
            Sign in to Fam Gold
          </h2>
          <p className="text-gray-600">
            To sign in, please type in the email address linked to your account
            and your password.
          </p>
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
                placeholder="••••••••"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                required
                value={password}
                onChange={handleChange}
              />
            </div>
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="remember"
                  aria-describedby="remember"
                  name="remember"
                  type="checkbox"
                  className="bg-gray-50 border-gray-300 focus:ring-3 focus:ring-cyan-200 h-4 w-4 rounded"
                />
              </div>
              <div className="text-sm ml-3">
                <label htmlFor="remember" className="font-medium text-gray-900">
                  Remember me
                </label>
              </div>
              <Link
                to="/forgot-password"
                className="text-sm text-indigo-500 hover:underline ml-auto"
              >
                Forgot Password?
              </Link>
            </div>
            <button
              type="submit"
              className="text-white bg-[#060270] bg-opacity-90 font-medium rounded-lg text-base px-5 py-3 w-full sm:w-auto text-center"
              disabled={isLoading}
            >
              {isLoading ? "Wait..." : "Login to your account"}
            </button>
          </form>
        </div>
      </div>
    </AuthLayout>
  );
}
