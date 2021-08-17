# react-sanctum - React components for Laravel Sanctum

[![npm version](https://badge.fury.io/js/react-sanctum.svg)](https://www.npmjs.com/package/react-sanctum)

The react-sanctum package aims to provide an easy way to authenticate your React application with Laravel Sanctum.

## Usage

Install from NPM

```
npm i react-sanctum
```

Wrap your application in an `<Sanctum>` component

Example:

```js
import React from "react";

import { Sanctum } from "react-sanctum";

const sanctumConfig = {
    apiUrl: "http://foobar.test",
    csrfCookieRoute: "sanctum/csrf-cookie",
    signInRoute: "login",
    signOutRoute: "logout",
    twoFactorChallengeRoute: 'two-factor-challenge',
    userObjectRoute: "user",
};

const App = () => (
    <div className="my-application">
        <Sanctum config={sanctumConfig}>/* Your application code */</Sanctum>
    </div>
);
```

You can then use the `withSanctum` higher-order component to get authentication status, user data and sanctum related
methods in any component.

```js
import React from "react";
import { withSanctum } from "react-sanctum";

const LoginButton = ({authenticated, user, signIn}) => {
    const handleLogin = () => {
        const email = "sanctum@example.org";
        const password = "example";
        const remember = true;

        signIn(email, password, remember)
            .then(() => window.alert("Signed in!"))
            .catch(() => window.alert("Incorrect email or password"));
    };

    if (authenticated === true) {
        return <h1>Welcome, {user.name}</h1>;
    } else {
        return <button onClick={handleLogin}>Sign in</button>;
    }
};

export default withSanctum(LoginButton);
```

You can also directly consume the Sanctum context by importing `SanctumContext`.

Both the `SanctumContext` and the `withSanctum` HOC give you access to the following
data and methods:
| | Description |
|-|------------------------------------------------------------------------------------|
| `user` | Object your API returns with user data |
| `authenticated` | Boolean, or null if authentication has not yet been checked |
| `signIn()` | Accepts `(email, password, remember?)`, returns a promise, resolves with `{twoFactor: boolean, signedIn: boolean, user: {}}`. |
| `signOut()` | Returns a promise |
| `setUser()` | Accepts `(user, authenticated?)`, allows you to manually set the user object and optionally its authentication status (boolean). |
| `twoFactorChallenge()` | Accepts `(code, recovery?)`, returns a promise, resolves with the user object. |
| `checkAuthentication()` | Returns the authentication status. If it's null, it will ask the server and update `authenticated`. |

# Setup

All URLS in the config are required. These need to be created in your Laravel app.

```js
const sanctumConfig = {
    // Your application URL
    apiUrl: "http://foobar.test",
    // The following settings are URLS that need to be created in your Laravel application
    // The URL sanctum uses for the csrf cookie
    csrfCookieRoute: "sanctum/csrf-cookie",
    // {email: string, password: string, remember: true | null} get POSTed to here
    signInRoute: "api/login",
    // A POST request is sent to this route to sign the user out
    signOutRoute: "api/logout",
    // Used (GET) for checking if the user is signed in (so this should be protected)
    // The returned object will be avaiable as `user` in the React components.
    userObjectRoute: "api/user",
    // The URL where the OTAP token or recovery code will be sent to.
    // Only needed if you want to use two factor authentication.
    twoFactorChallengeRoute: 'two-factor-challenge',
    // An axios instance to be used by react-sanctum (optional). Useful if you for example need to add custom interceptors.
    axiosInstance: AxiosInstance,
};
```

react-sanctum automatically checks if the user is signed in when the the `<Sanctum>`
component gets mounted. If you don't want this, and want to manually use the
`checkAuthentication` function later, set `checkOnInit` to `false` like so:

```js
<Sanctum config={sanctumConfig} checkOnInit={true}>
```

# Handling registration

Methods for signIn and signOut are provided by this library. Registration is not included as there seem to be many ways
people handle registration flows.

If you want to sign in your user after registration, there's an easy way to do this. First, make sure the endpoint you
post the registration data to signs in the user (`Auth::guard()->login(...)`) and have it return the user object to the
front-end.

In your front-end you can then pass this user object into the `setUser()` function, et voilà, your new user has been
signed in.

For example:

```js
axios
    .post(`${API_URL}/register`, data)
    .then(function (response) {
        const user = response.data;
        setUser(user); // The react-sanctum setUser function
        ...
    })
    .catch(function (error) {
        ...
    });
```

# Two factor authentication
This package supports two factor authentication using Laravel Fortify out of the box.

1. Install Laravel Fortify using the following instructions
https://laravel.com/docs/8.x/fortify#installation

2. Add the `TwoFactorAuthenticable` trait to the User modal
https://laravel.com/docs/8.x/fortify#two-factor-authentication

3. Make sure the `two-factor-challenge` route is included in the `config/cors.php` file.

Example for implementation:

```js
import React, { useState } from "react";
import { withSanctum, ContextProps } from "react-sanctum";

const Login: React.FC<ContextProps> = ({
  authenticated,
  user,
  signIn,
  twoFactorChallenge,
}) => {
  const [showTwoFactorForm, setShowTwoFactorForm] = useState(false);
  const [code, setCode] = useState("");
  const [recoveryCode, setRecoveryCode] = useState("");

  const handleLogin = () => {
    const email = "sanctum@example.org";
    const password = "password";
    const remember = true;

    signIn(email, password, remember)
      .then(({ twoFactor }) => {
        if (twoFactor) {
          setShowTwoFactorForm(true);
          return;
        }

        window.alert("Signed in without token!");
      })
      .catch(() => window.alert("Incorrect email or password"));
  };

  const handleTwoFactorChallenge = (recovery: boolean = false) => {
    twoFactorChallenge(recovery ? recoveryCode : code, recovery)
      .then(() => window.alert("Signed in with token!"))
      .catch(() => window.alert("Incorrect token"));
  };

  if (authenticated === true) {
    return <h1>Welcome, {user.name}</h1>;
  } else {
    if (showTwoFactorForm) {
      return (
        <div>
          <input
            type="text"
            onInput={(event) => setCode(event.currentTarget.value)}
          />
          <button onClick={() => handleTwoFactorChallenge()}>
            Sign in using OTAP-token
          </button>
          <hr />
          <input
            type="text"
            onInput={(event) => setRecoveryCode(event.currentTarget.value)}
          />
          <button onClick={() => handleTwoFactorChallenge(true)}>
            Sign in using recovery token
          </button>
        </div>
      );
    }

    return <button onClick={handleLogin}>Sign in</button>;
  }
};

export default withSanctum(Login);
```

# Axios

Quick tip for people using axios: react-sanctum uses Axios for making requests to your server. If your project is also
using axios, make sure to set
`axios.defaults.withCredentials = true;`. That way axios will authenticate your requests to the server properly.
