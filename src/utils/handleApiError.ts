/* eslint-disable @typescript-eslint/no-explicit-any */
export const handleApiError = (error: any, logoutCallback?: () => void) => {
  if (error.response.status === 401) {
    logoutCallback?.();
  }
  if (
    error.response?.data?.message?.startsWith(
      "You are not logged in, try to log in"
    )
  ) {
    logoutCallback?.();
  }
};
