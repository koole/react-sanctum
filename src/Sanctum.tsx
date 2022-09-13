import React, { useEffect, useState, useMemo } from "react";
import axios, { AxiosInstance } from "axios";
import SanctumContext from "./SanctumContext";

axios.defaults.withCredentials = true;

export interface ConfigProps {
  apiUrl: string;
  csrfCookieRoute: string;
  signInRoute: string;
  signOutRoute: string;
  userObjectRoute: string;
  twoFactorChallengeRoute?: string;
  axiosInstance?: AxiosInstance;
  usernameKey?: string;
}

interface Props {
  config: ConfigProps;
  checkOnInit?: boolean;
  children: React.ReactNode;
}

const Sanctum: React.FC<Props> = ({ checkOnInit = true, config, children }) => {
  const localAxiosInstance = useMemo(
    () => config.axiosInstance || axios.create(),
    [config.axiosInstance]
  );

  const [sanctumState, setSanctumState] = useState<{
    user: null | {};
    authenticated: null | boolean;
  }>({ user: null, authenticated: null });
  const user = sanctumState.user;
  const authenticated = sanctumState.authenticated;

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
    username: string,
    password: string,
    remember: boolean = false
  ): Promise<{ twoFactor: boolean; signedIn: boolean; user?: {} }> => {
    const { apiUrl, signInRoute, usernameKey } = config;

    return new Promise(async (resolve, reject) => {
      try {
        // Get CSRF cookie.
        await csrf();

        // Sign in.
        const { data: signInData } = await localAxiosInstance.post(
          `${apiUrl}/${signInRoute}`,
          {
            [usernameKey || "email"]: username,
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
        setSanctumState({ user: null, authenticated: false });
        resolve();
      } catch (error) {
        return reject(error);
      }
    });
  };

  const setUser = (user: object, authenticated: boolean = true) => {
    setSanctumState({ user, authenticated });
  };

  const revalidate = (): Promise<boolean | { user: {} }> => {
    const { apiUrl, userObjectRoute } = config;
    
    return new Promise(async (resolve, reject) => {
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
        if (axios.isAxiosError(error)) {
          if (error.response && error.response.status === 401) {
            // If there's a 401 error the user is not signed in.
            setSanctumState({ user: null, authenticated: false });
            return resolve(false);
          } else {
            // If there's any other error, something has gone wrong.
            return reject(error);
          }
        } else {
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
          if (axios.isAxiosError(error)) {
            if (error.response && error.response.status === 401) {
              // If there's a 401 error the user is not signed in.
              setSanctumState({ user: null, authenticated: false });
              return resolve(false);
            } else {
              // If there's any other error, something has gone wrong.
              return reject(error);
            }
          } else {
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
        user,
        authenticated,
        signIn,
        twoFactorChallenge,
        signOut,
        setUser,
        checkAuthentication,
      }}
    />
  );
};

export default Sanctum;
