import axios from "axios";
import url from "./url";

let user;

if (typeof window !== "undefined") {
  user = window.sessionStorage.getItem("user");
}
const sessionUser = user ? JSON.parse(user) : null;

const axiosInstance = axios.create({
  baseURL: url,
});

axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${
  sessionUser?.token || null
}`;

export const setAuthorizationToken = (token: string) => {
  if (token) {
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common["Authorization"];
  }
};

export default axiosInstance;
