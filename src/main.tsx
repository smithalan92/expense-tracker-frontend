/// <reference types="vite-plugin-svgr/client" />

import React from "react";
import ReactDOM from "react-dom/client";
import "@/styles/index.css";
import { RouterProvider } from "react-router-dom";
import { store } from "@/store";
import { Provider } from "react-redux";
import router from "@/router";
import "@/styles/index.css";
import { restoreLocalStorage } from "@/store/slices/app";

store.dispatch(restoreLocalStorage());

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
