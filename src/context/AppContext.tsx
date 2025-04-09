/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-refresh/only-export-components */
import { ReactNode, createContext, useState } from "react";
import url from "../helpers/url";
import Toast from "react-hot-toast";
import axios, { setAuthorizationToken } from "../helpers/axios";

interface AppContextProviderProps {
  children: ReactNode;
}

interface LoginData {
  email: string;
  password: string;
}
interface RegisterData {
  firstname: string;
  lastname: string;
  email: string;
  phoneNumber: string;
  password: string;
  memberID: string;
  share: string;
  additionalInfo: string;
}

// create a new context file for the app
const AppContext = createContext<{
  user?: any;
  isLoggedIn?: boolean;
  isAdmin?: boolean;
  isLoading?: boolean;
  error?: any;
  handleLoading?: (isLoading: boolean) => void;
  handleLogin?: (loginData: LoginData) => void;
  handleRegister?: (registerData: RegisterData) => void;
  handleLogout?: () => void;
  reloadUser?: () => void;
}>({});

export const getUserFromSessionStorage = () => {
  let user;
  if (typeof window !== "undefined") {
    user = window.sessionStorage.getItem("user");
  }
  return user ? JSON.parse(user) : null;
};

const syncUserToSessionStorage = (user: any) => {
  if (user && typeof window !== "undefined") {
    window.sessionStorage.setItem("user", JSON.stringify(user));
  } else {
    window.sessionStorage.removeItem("user");
  }
};

const AppContextProvider: React.FC<AppContextProviderProps> = ({
  children,
}) => {
  const [state, setState] = useState({
    user: getUserFromSessionStorage(),
    isLoggedIn: getUserFromSessionStorage()?.token ? true : false,
    isLoading: false,
    error: null,
  });
  console.log(state);

  const handleLogin = async ({ email, password }: LoginData) => {
    try {
      handleLoading(true);
      console.log("login");
      const response = await axios.post(url + "/auth/signin", {
        login: email,
        password,
      });
      if (response.data.success) {
        const user = {
          info: response.data.data?.user,
          token: response.data.data?.token,
        };
        if (user.info?.status === "PENDING") {
          throw new Error("Your account is still pending approval");
        }
        setState((state) => {
          return {
            ...state,
            user,
            isLoggedIn: true,
          };
        });
        syncUserToSessionStorage(user);
        setAuthorizationToken(user.token);
        Toast.success("Login successful");
      }
    } catch (error: any) {
      const message =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong";
      handleError(message);
      Toast.error(message);
    } finally {
      handleLoading(false);
    }
  };

  const handleRegister = async (registerData: RegisterData) => {
    try {
      handleLoading(true);
      const response = await axios.post(url + "/auth/register", registerData);
      if (response.data) {
        Toast.success("Registration successful");
        return true;
      }
    } catch (error: any) {
      const message =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        "Something went wrong";
      handleError(message);
      Toast.error(message);
      return false;
    } finally {
      handleLoading(false);
    }
  };

  const handleLogout = () => {
    setState((state) => {
      return {
        ...state,
        user: null,
        isLoggedIn: false,
      };
    });
    syncUserToSessionStorage(null);
    setAuthorizationToken("");
  };

  const handleError = (error: any) => {
    setState((state) => {
      return {
        ...state,
        error,
      };
    });
  };

  const handleLoading = (isLoading: boolean) => {
    setState((state) => {
      return {
        ...state,
        isLoading,
      };
    });
  };

  const reloadUser = async () => {
    try {
      handleLoading(true);
      const response = await axios.get(url + "/auth/profile");
      if (response.data?.id) {
        const user = {
          info: response.data,
          token: state.user?.token,
        };
        setState((state) => {
          return {
            ...state,
            user,
            isLoggedIn: true,
          };
        });
        syncUserToSessionStorage(user);
        setAuthorizationToken(user.token);
      }
    } catch (error: any) {
      const message =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        "Something went wrong";
      handleError(message);
      Toast.error(message);
    } finally {
      handleLoading(false);
    }
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        isAdmin: state.user?.info?.isAdmin ? true : false,
        handleLoading,
        handleLogin,
        handleRegister,
        handleLogout,
        reloadUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppContextProvider };
