import React from "react";
import ReactDOM from "react-dom";
import { Sanctum } from "react-sanctum";
import App from "./App";

const apiUrl = "http://127.0.0.1:8000";

const sanctumConfig = {
  apiUrl,
  csrfCookieRoute: "sanctum/csrf-cookie",
  signInRoute: "login",
  signOutRoute: "logout",
  userObjectRoute: "api/user",
  twoFactorChallengeRoute: "two-factor-challenge",
};

ReactDOM.render(
  <React.StrictMode>
    <Sanctum config={sanctumConfig}>
      <App apiUrl={apiUrl} />
    </Sanctum>
  </React.StrictMode>,
  document.getElementById("root")
);
