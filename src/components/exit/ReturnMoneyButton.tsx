/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from "react";
import axiosInstance from "../../helpers/axios";
import url from "../../helpers/url";
import { formatCurrency } from "../../utils/functions";
import { handleApiError } from "../../utils/handleApiError";
import { AppContext } from "../../context/AppContext";

type ReturnMoneyButtonProps = {
  userId: string;
};

const ReturnMoneyButton: React.FC<ReturnMoneyButtonProps> = ({ userId }) => {
  const [returnMoney, setReturnMoney] = React.useState(0);
  const { handleLogout } = React.useContext(AppContext);
  useEffect(() => {
    (async () => {
      try {
        const response = await axiosInstance.get(
          url + `/users/return-money-on-leave/${userId}`
        );
        setReturnMoney(response.data.data?.returnMoneyOnLeave || 0);
      } catch (error: any) {
        handleApiError(error, handleLogout);
      }
    })();
  }, [userId]);
  return (
    <p className="text-sm font-medium text-gray-700 mb-2">
      (Return Money on Exiting: {formatCurrency(returnMoney || 0)} RWF)
    </p>
  );
};

export default ReturnMoneyButton;
