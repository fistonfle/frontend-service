/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

import axiosInstance from "../helpers/axios";
import url from "../helpers/url";
import toast from "react-hot-toast";
import MainLayout from "../layouts/MainLayout";
import { AppContext } from "../context/AppContext";
import { formatCurrency } from "../utils/functions";
import { handleApiError } from "../utils/handleApiError";

const validationSchema = Yup.object().shape({
  memberID: Yup.string().required("Staff ID is required"),
  amount: Yup.number().required("Amount is required"),
  isRelatedToPartialExit: Yup.boolean(),
});

function RequestWithdrawalPage() {
  const navigate = useNavigate();
  const [allowedBalance, setAllowedBalance] = React.useState<any>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { user } = useContext(AppContext);

  const initialValues = {
    memberID: user?.info?.memberID ?? "",
    amount: 0,
    isRelatedToPartialExit: false,
  };

  const { handleLogout } = React.useContext(AppContext);

  const handleSubmit = async (values: any) => {
    try {
      setIsSubmitting(true);
      // validate amount
      if (
        values.amount > allowedBalance.amount + 50000 ||
        (values.isRelatedToPartialExit && allowedBalance.amount < 50000)
      ) {
        toast.error(
          "Amount exceeds allowed balance or insufficient balance for partial exit"
        );
        setIsSubmitting(false);
        return;
      }
      await axiosInstance.post(url + "/withdrawal-requests", values);
      toast.success("Withdrawal requested successfully");
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
      if (!user?.info.id) {
        setAllowedBalance({});
        return;
      }
      const response = await axiosInstance.get(
        url + `/withdrawals/user/allowed-withdrawal-balance/${user?.info.id}`
      );
      const balance = response.data?.data || {};
      setAllowedBalance({
        userId: balance.id,
        amount: Math.floor(balance.allowedWithdrawalBalance),
      });
    })();
  }, [user?.info.id]);

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
            Request a withdrawal
          </h2>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
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
                {allowedBalance.userId === user?.info?.id && (
                  <p className="text-sm text-gray-500">
                    Allowed Balance:{" "}
                    {formatCurrency(
                      Math.max(
                        values.isRelatedToPartialExit
                          ? allowedBalance.amount
                          : allowedBalance.amount + 50000,
                        0
                      )
                    )}{" "}
                    RWF
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
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Field
                      type="checkbox"
                      name="isRelatedToPartialExit"
                      id="isRelatedToPartialExit"
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setFieldValue(
                          "isRelatedToPartialExit",
                          e.target.checked
                        );
                      }}
                    />
                    <label
                      htmlFor="isRelatedToPartialExit"
                      className="text-sm font-medium text-gray-900 block"
                    >
                      Related to Partial Exit?
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">
                    Checking this box will adjust the allowed balance
                    accordingly. If checked, the withdrawal will be related to a
                    partial exit, and the account must contain at least 50,000
                    RWF after the withdrawal. If unchecked, an additional 50,000
                    RWF will be added to the allowed balance.
                  </p>
                </div>
                <button
                  type="submit"
                  className="text-white bg-[#060270] bg-opacity-90 font-medium rounded-lg text-base px-5 py-3 w-full sm:w-auto text-center"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Wait..." : "Request Withdrawal"}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </MainLayout>
  );
}

export default RequestWithdrawalPage;
