import React, { useEffect } from "react";
import url from "../../helpers/url";
import axiosInstance from "../../helpers/axios";
import { formatCurrency } from "../../utils/functions";

type Props = {
  hasStoppedContributing: boolean;
  memberHasLeft: boolean;
  onDeactivate: () => void;
  onReactivate: () => void;
  onStopContributing: () => void;
  onResumeContributing: () => void;
  userId: string;
};

const MemberStatusInfo = ({
  hasStoppedContributing,
  memberHasLeft,
  onDeactivate,
  onReactivate,
  onStopContributing,
  onResumeContributing,
  userId,
}: Props) => {
  const [returnMoney, setReturnMoney] = React.useState(0);
  useEffect(() => {
    (async () => {
      const response = await axiosInstance.get(
        url + `/users/return-money-on-leave/${userId}`
      );
      setReturnMoney(response.data.data?.returnMoneyOnLeave || 0);
    })();
  }, [userId]);
  return (
    <div>
      <div className="flex flex-col space-y-3 mt-5">
        <div className="flex flex-col space-y-1">
          <label className="text-sm font-medium text-gray-700">
            Member Status
          </label>
          <div className="flex items-center space-x-2">
            {!memberHasLeft ? (
              <>
                <span className="inline-block h-3 w-3 rounded-full bg-green-400"></span>
                <span className="text-sm font-medium text-gray-700">
                  Active Member
                </span>
              </>
            ) : (
              <>
                <span className="inline-block h-3 w-3 rounded-full bg-red-400"></span>
                <span className="text-sm font-medium text-gray-700">
                  Left Group
                </span>
              </>
            )}
            <button
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500 ml-10"
              onClick={() => (memberHasLeft ? onReactivate() : onDeactivate())}
            >
              {memberHasLeft ? "Re-activate" : "Leave Group"}
            </button>
            {!memberHasLeft && (
              <span className="text-sm font-medium text-gray-700 ml-10">
                (Return Money on Exiting: {formatCurrency(returnMoney || 0)}{" "}
                RWF)
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-col space-y-1">
          <label className="text-sm font-medium text-gray-700">
            Contribution Status
          </label>
          <div className="flex items-center space-x-2">
            {hasStoppedContributing ? (
              <>
                <span className="inline-block h-3 w-3 rounded-full bg-yellow-400"></span>
                <span className="text-sm font-medium text-gray-700">
                  Stopped Contributing
                </span>
              </>
            ) : (
              <>
                <span className="inline-block h-3 w-3 rounded-full bg-green-400"></span>
                <span className="text-sm font-medium text-gray-700">
                  Active Contributor
                </span>
              </>
            )}
            <button
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500 ml-10"
              onClick={() =>
                hasStoppedContributing
                  ? onResumeContributing()
                  : onStopContributing()
              }
            >
              {hasStoppedContributing
                ? "Resume Contributing"
                : "Stop Contributing"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberStatusInfo;
