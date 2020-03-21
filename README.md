# react-sanctum - React components for Laravel Sanctum

⚠️ This is _very_ much a work in progress.

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
  api_url: "http://foobar.test",
  csrf_cookie_route: "sanctum/csrf-cookie",
  login_route: "login",
  logout_route: "logout",
  user_object_route: "api/user"
};

const App = () => (
  <div class="my-application">
    <Sanctum config={sanctumConfig}>
      // Your application code
    </Sanctum>
  </div>
);
```

You can then use the `withSanctum` higher-order component to get authentication status, user data and sanctum related methods in any component.

```js
import React from "react";
import { Sanctum } from "react-sanctum";

const LoginButton = ({ authenticated, user, signIn }) => {
  const handleLogin = () => {
    const email = "sanctum@example.org";
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

export default withSanctum(LoginButton);
```

You can also directly consume the Sanctum context by importing `SanctumContext`.

Both the `SanctumContext` and the `withSanctum` HOC give you access to the following data and methods:
| | Description |
|---------------------|-----------------------------------------------------------------------------------------------------|
| `user` | Object your API returns with user data |
| `authenticated` | Boolean, or null if authentication has not yet been checked |
| `signIn()` | Accepts (email, password), returns a promise. |
| `signOut()` | Returns a promise |
| `checkAuthentication()` | Returns the authentication status. If it's null, it will ask the server and update `authenticated`. |

# Setup

All URLS in the config are required. These need to be created in your Laravel app.

```js
const sanctumConfig = {
  // Your applications URL
  api_url: "http://foobar.test",
  // The following settings are URLS that need to be created in your Laravel application
  // The URL sanctum uses for the csrf cookie
  csrf_cookie_route: "sanctum/csrf-cookie",
  // Email and password get POSTed to here
  signin_route: "login",
  // A POST request is sent to this route to sign the user out
  signout_route: "logout",
  // Used for checking if the user is signed in (so this should be protected)
  // The returned object will be avaiable as `user` in the React components.
  user_object_route: "api/user"
};
```

react-sanctum automatically checks if the user is signed in when the the `<Sanctum>` component gets mounted. If you don't want this, and want to manually use the `checkAuthentication` function later, set `checkOnInit` to `false` like so:

```js
<Sanctum config={sanctumConfig} checkOnInit={true}>
```
