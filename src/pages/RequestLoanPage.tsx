/* eslint-disable no-empty-pattern */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

import axiosInstance from "../helpers/axios";
import url from "../helpers/url";
import { Select } from "antd";
import toast from "react-hot-toast";
import MainLayout from "../layouts/MainLayout";
import { AppContext } from "../context/AppContext";
import { formatCurrency } from "../utils/functions";
import { handleApiError } from "../utils/handleApiError";
import Input from "../components/reusable/Input";

type Option = {
  value: string;
  label: string;
  name: string;
};

const validationSchema = Yup.object().shape({
  memberID: Yup.string().required("Staff ID is required"),
  customPaymentMonths: Yup.number().optional(),
  amount: Yup.number().required("Amount is required"),
  loanTypeId: Yup.string().required("Loan type is required"),
});

function RequestLoanPage() {
  const navigate = useNavigate();

  const [allowedBalance, setAllowedBalance] = React.useState({
    userId: "",
    amount: 0,
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [selectedLoanType, setSelectedLoanType] = React.useState<any>(null);

  const [loanTypesOptions, setLoanTypesOptions] = React.useState<Option[]>([]);

  const { user } = useContext(AppContext);

  useEffect(() => {
    (async () => {
      const response2 = await axiosInstance.get(url + "/loan-types");
      const loanTypes = response2.data?.data || [];
      setLoanTypesOptions(
        loanTypes.map((loanType: any) => ({
          value: loanType.id,
          label: loanType.name + " (" + loanType.paymentMonths + " months)",
          name: loanType.name,
        }))
      );
    })();
  }, []);

  const initialValues = {
    memberID: user?.info?.memberID ?? "",
    customPaymentMonths: 0,
    amount: 0,
    loanTypeId: "",
    startPaymentDate: new Date().toISOString().split("T")[0],
  };

  const { handleLogout } = React.useContext(AppContext);

  const handleSubmit = async (values: any) => {
    try {
      setIsSubmitting(true);
      // validate amount
      if (values.amount > allowedBalance.amount) {
        toast.error("Amount exceeds allowed balance");
        setIsSubmitting(false);
        return;
      }

      await axiosInstance.post(url + "/loan-requests", {
        ...values,
        date: new Date().toISOString(),
        startPaymentDate: new Date(values.startPaymentDate).toISOString(),
      });
      toast.success("Loan created successfully");
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

  useEffect(() => {
    (async () => {
      if (user?.info?.id) {
        const overdraftLoan = loanTypesOptions.find((loanType) =>
          loanType.name.includes("Overdraft")
        );

        const response =
          selectedLoanType === overdraftLoan?.value
            ? await axiosInstance.get(
                url + "/loans/allowed-overdraft/" + user?.info?.id
              )
            : await axiosInstance.get(
                url + "/loans/allowed-balance/" + user?.info?.id
              );
        const userBalance = response.data?.data || {};
        setAllowedBalance({
          userId: userBalance.id,
          amount: Math.ceil(userBalance.allowedBalance),
        });
      }
    })();
  }, [user?.info?.id, selectedLoanType]);

  return (
    <MainLayout
      title=""
      newButtonTitle=""
      onNewButtonClick={() => {}}
      hideNewButton={true}
      hideFilters={true}
    >
      <div className="bg-white md:mt-0 w-full my-2 xl:p-0">
        <div className="p-6 space-y-8">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
            Request a loan
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
                    disabled={true}
                  />
                  <ErrorMessage
                    name="memberID"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                <label
                  htmlFor="loanTypeId"
                  className="flex mt-4 text-sm font-semibold text-gray-600"
                >
                  Loan Type
                </label>
                <Select
                  id="loanTypeId"
                  className="w-full"
                  placeholder="Select Loan Type"
                  options={loanTypesOptions}
                  value={values.loanTypeId || "Select Loan Type"}
                  onChange={(value) => {
                    setFieldValue("loanTypeId", value);
                    setSelectedLoanType(value);
                  }}
                  showSearch
                  allowClear
                  filterOption={(input, option) =>
                    (option?.label || "")
                      ?.toLowerCase()
                      ?.indexOf(input.toLowerCase()) >= 0
                  }
                />

                {allowedBalance.userId === user?.info?.id && (
                  <p className="text-sm text-gray-500">
                    Allowed Balance:{" "}
                    {formatCurrency(Math.max(allowedBalance.amount, 0))} RWF
                  </p>
                )}
                <div>
                  <label
                    htmlFor="amount"
                    className="text-sm font-medium text-gray-900 block mb-2"
                  >
                    Amount
                  </label>
                  <Field
                    type="number"
                    name="amount"
                    id="amount"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                    placeholder="Enter Amount"
                  />
                  <ErrorMessage
                    name="amount"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                <Input
                  type="date"
                  label="Start Payment Date"
                  name="startPaymentDate"
                  value={values.startPaymentDate || ""}
                  onInputChange={(e) => {
                    setFieldValue("startPaymentDate", e.target.value);
                  }}
                />

                <div>
                  <label
                    htmlFor="customPaymentMonths"
                    className="text-sm font-medium text-gray-900 block mb-2"
                  >
                    Custom Payment Months
                  </label>
                  <Field
                    type="number"
                    name="customPaymentMonths"
                    id="customPaymentMonths"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                    placeholder="Enter Custom Payment Months"
                  />
                  <ErrorMessage
                    name="customPaymentMonths"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                <button
                  type="submit"
                  className="text-white bg-[#060270] bg-opacity-90 font-medium rounded-lg text-base px-5 py-3 w-full sm:w-auto text-center"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Wait..." : "Request Loan"}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </MainLayout>
  );
}

export default RequestLoanPage;
