import React from "react";
import { createRoot } from "react-dom/client";
import axios from "axios";
import { Sanctum } from "react-sanctum";
import App from "./App";

const apiUrl = "http://127.0.0.1:8000";
const axiosInstance = axios.create();

const sanctumConfig = {
  apiUrl,
  csrfCookieRoute: "sanctum/csrf-cookie",
  signInRoute: "login",
  signOutRoute: "logout",
  userObjectRoute: "api/user",
  twoFactorChallengeRoute: "two-factor-challenge",
  axiosInstance: axiosInstance
};

// Create a root first
const root = createRoot(document.getElementById("root") as HTMLElement);

// Then render your app to that root
root.render(
  <React.StrictMode>
    <Sanctum config={sanctumConfig}>
      <App apiUrl={apiUrl} />
    </Sanctum>
  </React.StrictMode>
);