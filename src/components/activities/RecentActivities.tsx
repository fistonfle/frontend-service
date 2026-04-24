/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

type Activity = {
  id: string;
  actor?: any;
  member?: any;
  activityType?: string;
  description?: string;
  createdAt?: string;
};

export default function RecentActivities({
  title = "Recent Activities",
  activities,
}: {
  title?: string;
  activities: Activity[];
}) {
  return (
    <div className="bg-white p-4 shadow rounded-lg mt-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>

      <div className="mt-3 divide-y">
        {(activities || []).length === 0 ? (
          <div className="text-sm text-gray-400 py-4 text-center">
            No recent activities.
          </div>
        ) : (
          (activities || []).map((a) => (
            <div key={a.id} className="py-3">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-800 font-medium">
                  {a.description || a.activityType}
                </div>
                <div className="text-xs text-gray-400">
                  {a.createdAt
                    ? new Date(a.createdAt).toLocaleString()
                    : ""}
                </div>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {a.actor?.firstname ? (
                  <span>
                    By: {a.actor.firstname} {a.actor.lastname}
                  </span>
                ) : null}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

