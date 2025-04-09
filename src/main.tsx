import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { AppContextProvider } from "./context/AppContext.tsx";
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppContextProvider>
      <App />
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "#333",
            color: "#fff",
          },
        }}
      />
    </AppContextProvider>
  </React.StrictMode>
);
