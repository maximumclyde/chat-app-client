import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";

import App from "./App.tsx";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary.tsx";
import store from "./store/index.ts";

import "./index.scss";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;
axios.defaults.headers.common["Authorization"] = `Bearer ${
  localStorage.getItem("authenticationToken") || ""
}`;

if (import.meta.env.MODE === "production") {
  console.log = () => {};
  console.warn = () => {};
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <Provider store={store}>
      <BrowserRouter>
        <React.StrictMode>
          <App />
        </React.StrictMode>
      </BrowserRouter>
    </Provider>
  </ErrorBoundary>
);
