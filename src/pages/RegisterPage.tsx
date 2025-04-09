/* eslint-disable no-empty-pattern */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

import { AppContext } from "../context/AppContext";
import AuthLayout from "../layouts/AuthLayout";

const validationSchema = Yup.object().shape({
  firstname: Yup.string().required("First name is required"),
  lastname: Yup.string().required("Last name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phoneNumber: Yup.string().required("Phone number is required"),
  // requestLetter: Yup.string().required("Request letter is required"),
  memberID: Yup.string().required("Staff ID is required"),
  share: Yup.number().required("Member contribution is required"),
  additionalInfo: Yup.string().optional(),
});

function RegisterPage() {
  const navigate = useNavigate();
  const { handleRegister, isLoading } = useContext(AppContext) || {};

  const initialValues = {
    firstname: "",
    lastname: "",
    email: "",
    phoneNumber: "",
    // requestLetter: "",
    memberID: "",
    share: "",
    additionalInfo: "",
  };

  const handleSubmit = async (values: any) => {
    if (await handleRegister?.(values)) {
      navigate("/login");
    }
  };

  return (
    <AuthLayout currentRoute="register">
      <div className="bg-white md:mt-0 w-full sm:max-w-screen-sm xl:p-0">
        <div className="p-6 space-y-8">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
            Request to be a member
          </h2>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            // handle setFieldValue
          >
            {({}) => (
              <Form className="mt-8 space-y-6">
                <div>
                  <label
                    htmlFor="firstname"
                    className="text-sm font-medium text-gray-900 block mb-2"
                  >
                    First Name
                  </label>
                  <Field
                    type="text"
                    name="firstname"
                    id="firstname"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                    placeholder="Enter your first name"
                  />
                  <ErrorMessage
                    name="firstname"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>
                <div>
                  <label
                    htmlFor="lastname"
                    className="text-sm font-medium text-gray-900 block mb-2"
                  >
                    Last Name
                  </label>
                  <Field
                    type="text"
                    name="lastname"
                    id="lastname"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                    placeholder="Enter your last name"
                  />
                  <ErrorMessage
                    name="lastname"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-900 block mb-2"
                  >
                    Your email
                  </label>
                  <Field
                    type="email"
                    name="email"
                    id="email"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                    placeholder="name@company.com"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>
                <div>
                  <label
                    htmlFor="phoneNumber"
                    className="text-sm font-medium text-gray-900 block mb-2"
                  >
                    Phone Number
                  </label>
                  <Field
                    type="text"
                    name="phoneNumber"
                    id="phoneNumber"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                    placeholder="Enter your Phone Number"
                  />
                  <ErrorMessage
                    name="phoneNumber"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                <div>
                  <label
                    htmlFor="memberID"
                    className="text-sm font-medium text-gray-900 block mb-2"
                  >
                    Staff ID
                  </label>
                  <Field
                    type="text"
                    name="memberID"
                    id="memberID"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                    placeholder="Enter your Staff ID"
                  />
                  <ErrorMessage
                    name="memberID"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                <div>
                  <label
                    htmlFor="share"
                    className="text-sm font-medium text-gray-900 block mb-2"
                  >
                    Member Contribution
                  </label>
                  <Field
                    type="number"
                    name="share"
                    id="share"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                    placeholder="Enter your Member Contribution"
                  />
                  <ErrorMessage
                    name="share"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                <div>
                  <label
                    htmlFor="additionalInfo"
                    className="text-sm font-medium text-gray-900 block mb-2"
                  >
                    Additional Information
                  </label>
                  <Field
                    as="textarea"
                    name="additionalInfo"
                    id="additionalInfo"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                    placeholder="Enter your Additional Information"
                  />
                  <ErrorMessage
                    name="additionalInfo"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                {/* <FileInput
                  onFileUploadComplete={(filedId: string) => {
                    setFieldValue("requestLetter", filedId);
                  }}
                />
                <ErrorMessage
                  name="requestLetter"
                  component="div"
                  className="text-red-500 text-xs"
                /> */}

                <button
                  type="submit"
                  className="text-white bg-[#060270] bg-opacity-90 font-medium rounded-lg text-base px-5 py-3 w-full sm:w-auto text-center"
                  disabled={isLoading}
                >
                  {isLoading ? "Wait..." : "Request to be a member"}
                </button>
                <div className="text-sm font-medium text-gray-500">
                  Already registered?{" "}
                  <Link
                    to="/login"
                    className="text-indigo-500 hover:underline cursor-pointer"
                  >
                    Login Here
                  </Link>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </AuthLayout>
  );
}

export default RegisterPage;
