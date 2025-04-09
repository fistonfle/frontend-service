/* eslint-disable no-empty-pattern */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import axiosInstance from "../helpers/axios";
import url from "../helpers/url";
import { Select } from "antd";
import toast from "react-hot-toast";
import MainLayout from "../layouts/MainLayout";
import { AppContext } from "../context/AppContext";
import { handleApiError } from "../utils/handleApiError";

const validationSchema = Yup.object().shape({
  exitRequestType: Yup.string().required("Exit Request Type is required"),
});

function RequestExitPage() {
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const initialValues = {
    exitRequestType: "",
  };

  const { handleLogout } = React.useContext(AppContext);

  const handleSubmit = async (values: any) => {
    try {
      setIsSubmitting(true);
      await axiosInstance.post(url + "/exit-requests", {
        ...values,
        date: new Date().toISOString(),
      });
      toast.success("Exit request successfully sent");
      navigate("/login");
    } catch (error: any) {
      handleApiError(error, handleLogout);
      console.log(error);
      const errorMessage =
        error.response.data.message || "Something went wrong";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const requestExitTypes = [
    { value: "PERMANENT", label: "Permanent Exit" },
    { value: "PARTIAL", label: "Partial Exit" },
    { value: "RESUME_PARTIAL", label: "Resume from Partial Exit" },
  ];

  return (
    <MainLayout
      title=""
      newButtonTitle=""
      onNewButtonClick={() => {}}
      hideNewButton={true}
      hideFilters={true}
    >
      <div className="bg-white w-full my-2 xl:p-0 mt-4">
        <div className="p-6 space-y-8">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
            Request (exiting / returning to) group
          </h2>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            // handle setFieldValue
          >
            {({ values, setFieldValue }) => (
              <Form className="mt-8 space-y-6">
                <div>
                  <label
                    htmlFor="exitRequestType"
                    className="flex mt-4 mb-2 text-sm font-semibold text-gray-600"
                  >
                    Exit Request Type
                  </label>
                  <Select
                    id="exitRequestType"
                    className="w-full"
                    placeholder="Select Exit Request Type"
                    options={requestExitTypes}
                    value={values.exitRequestType || "Select Exit Request Type"}
                    onChange={(value) => {
                      setFieldValue("exitRequestType", value);
                    }}
                    showSearch
                    allowClear
                    filterOption={(input, option) =>
                      (option?.label || "")
                        ?.toLowerCase()
                        ?.indexOf(input.toLowerCase()) >= 0
                    }
                  />
                </div>

                <button
                  type="submit"
                  className="text-white bg-[#060270] bg-opacity-90 font-medium rounded-lg text-base px-5 py-3 w-full sm:w-auto text-center"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? "Wait..."
                    : values.exitRequestType === "RESUME_PARTIAL"
                    ? "Request to Resume Partial Exit"
                    : "Request Exit"}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </MainLayout>
  );
}

export default RequestExitPage;
