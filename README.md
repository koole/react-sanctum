# react-airlock - React components for Laravel Airlock

⚠️ This is _very_ much a work in progress.

The react-airlock package aims to provide an easy way to authenticate your React application with Laravel Airlock.

## Usage

Install from NPM

```
npm i react-airlock
```

Wrap your application in an `<Airlock>` component

Example:

```js
import React from "react";

import { Airlock } from "react-airlock";

const airlockConfig = {
  api_url: "http://foobar.test",
  csrf_cookie_route: "airlock/csrf-cookie",
  login_route: "login",
  logout_route: "logout",
  user_object_route: "api/user"
};

const App = () => (
  <div class="my-application">
    <Airlock config={airlockConfig}>// Your application code</Airlock>
  </div>
);
```

You can then use the `withAirlock` higher-order component to get authentication status, user data and airlock related methods in any component.

```js
import React from "react";
import { Airlock } from "react-airlock";

const LoginButton = ({ authenticated, user, signIn }) => {
  const handleLogin = () => {
    const email = "airlock@example.org";
    const password = "example";

    signIn(email, password)
      .then(() => window.alert("Signed in!"))
      .catch(() => window.alert("Incorrect email or password"));
  };

  if (authenticated === true) {
    return <h1>Welcome, {user.name}</h1>;
  } else {
    return <Button onClick={handleLogin}>Sign in</Button>;
  }
};

export default withAirlock(LoginButton);
```

You can also directly consume the Airlock context by importing `AirlockContext`.

Both the `AirlockContext` and the `withAirlock` HOC give you access to the following data and methods:
| | Description |
|---------------------|-----------------------------------------------------------------------------------------------------|
| `user` | Object your API returns with user data |
| `authenticated` | Boolean, or null if authentication has not yet been checked |
| `signIn` | Accepts (email, password), returns a promise. |
| `signOut` | Returns a promise |
| `checkAuthentication` | Returns the authentication status. If it's null, it will ask the server and update `authenticated`. |

# Setup

All URLS in the config are required. These need to be created in your Laravel app.

```js
const airlockConfig = {
  // Your applications URL
  api_url: "http://foobar.test",
  // The following settings are URLS that need to be created in your Laravel application
  // The URL airlock uses for the csrf cookie
  csrf_cookie_route: "airlock/csrf-cookie",
  // Email and password get POSTed to here
  signin_route: "login",
  // A POST request is sent to this route to sign the user out
  signout_route: "logout",
  // Used for checking if the user is signed in (so this should be protected)
  // The returned object will be avaiable as `user` in the React components.
  user_object_route: "api/user"
};
```

react-airlock automatically checks if the user is signed in when the the `<Airlock>` component gets mounted. If you don't want this, and want to manually use the `checkAuthentication` function later, set `checkOnInit` to `false` like so:

```js
<Airlock config={airlockConfig} checkOnInit={true}>
```
