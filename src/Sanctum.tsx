import React, { useEffect, useState } from "react";
import axios, { AxiosInstance } from "axios";
import SanctumContext from "./SanctumContext";

axios.defaults.withCredentials = true;

interface Props {
  config: {
    apiUrl: string;
    csrfCookieRoute: string;
    signInRoute: string;
    signOutRoute: string;
    userObjectRoute: string;
    twoFactorChallengeRoute?: string;
    axiosInstance?: AxiosInstance;
  };
  checkOnInit?: boolean;
}

const Sanctum: React.FC<Props> = ({ checkOnInit, config, children }) => {
  const localAxiosInstance = config.axiosInstance || axios.create();

  const [currentUser, setCurrentUser] = useState<null | {}>(null);
  const [authenticated, setAuthenticated] = useState<null | boolean>(null);

  useEffect(() => {
    if (checkOnInit) {
      checkAuthentication();
    }
  }, [checkOnInit]);

  const csrf = () => {
    const { apiUrl, csrfCookieRoute } = config;
    return localAxiosInstance.get(`${apiUrl}/${csrfCookieRoute}`);
  };

  const signIn = (
    email: string,
    password: string,
    remember: boolean = false
  ): Promise<{ twoFactor: boolean; signedIn: boolean; user?: {} }> => {
    const { apiUrl, signInRoute } = config;

    return new Promise(async (resolve, reject) => {
      try {
        // Get CSRF cookie.
        await csrf();

        // Sign in.
        const { data: signInData } = await localAxiosInstance.post(
          `${apiUrl}/${signInRoute}`,
          {
            email,
            password,
            remember: remember ? true : null,
          },
          {
            maxRedirects: 0,
          }
        );

        // Handle two factor.
        if (typeof signInData === "object" && signInData.two_factor === true) {
          return resolve({ twoFactor: true, signedIn: false });
        }

        // Fetch user.
        const user = await revalidate();

        return resolve({ twoFactor: false, signedIn: true, user });
      } catch (error) {
        return reject(error);
      }
    });
  };

  const twoFactorChallenge = (
    code: string,
    recovery: boolean = false
  ): Promise<{}> => {
    const { apiUrl, twoFactorChallengeRoute } = config;

    return new Promise(async (resolve, reject) => {
      try {
        // The user can either use their OTP token or use a recovery code.
        const formData = recovery ? { recovery_code: code } : { code };

        await localAxiosInstance.post(
          `${apiUrl}/${twoFactorChallengeRoute}`,
          formData
        );

        // Fetch user.
        const user = await revalidate();

        return resolve(user);
      } catch (error) {
        return reject(error);
      }
    });
  };

  const signOut = () => {
    const { apiUrl, signOutRoute } = config;

    return new Promise<void>(async (resolve, reject) => {
      try {
        await localAxiosInstance.post(`${apiUrl}/${signOutRoute}`);
        // Only sign out after the server has successfully responded.
        setCurrentUser(null);
        setAuthenticated(false);
        resolve();
      } catch (error) {
        return reject(error);
      }
    });
  };

  const setUser = (user: object, authenticated: boolean = true) => {
    setCurrentUser(user);
    setAuthenticated(authenticated);
  };

  const revalidate = (): Promise<boolean | { user: {} }> => {
    return new Promise(async (resolve, reject) => {
      const { apiUrl, userObjectRoute } = config;

      try {
        const { data } = await localAxiosInstance.get(
          `${apiUrl}/${userObjectRoute}`,
          {
            maxRedirects: 0,
          }
        );

        setUser(data);

        resolve(data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          // If there's a 401 error the user is not signed in.
          setCurrentUser(null);
          setAuthenticated(false);
          return resolve(false);
        } else {
          // If there's any other error, something has gone wrong.
          return reject(error);
        }
      }
    });
  };

  const checkAuthentication = (): Promise<boolean> => {
    return new Promise(async (resolve, reject) => {
      if (authenticated === null) {
        // The status is null if we haven't checked it, so we have to make a request.
        try {
          await revalidate();
          return resolve(true);
        } catch (error) {
          if (error.response && error.response.status === 401) {
            // If there's a 401 error the user is not signed in.
            setCurrentUser(null);
            setAuthenticated(false);
            return resolve(false);
          } else {
            // If there's any other error, something has gone wrong.
            return reject(error);
          }
        }
      } else {
        // If it has been checked with the server before, we can just return the state.
        return resolve(authenticated);
      }
    });
  };

  return (
    <SanctumContext.Provider
      children={children || null}
      value={{
        user: currentUser,
        authenticated: authenticated,
        signIn: signIn,
        twoFactorChallenge: twoFactorChallenge,
        signOut: signOut,
        setUser: setUser,
        checkAuthentication: checkAuthentication,
      }}
    />
  );
};

export default Sanctum;
