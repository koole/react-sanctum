import * as React from "react";
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

interface State {
  user: null | {};
  authenticated: null | boolean;
}

class Sanctum extends React.Component<Props, State> {
  axios: AxiosInstance;

  static defaultProps = {
    checkOnInit: true,
    axiosInstance: axios.create(),
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      user: null,
      authenticated: null,
    };

    this.axios = props.config.axiosInstance || axios.create();

    this.signIn = this.signIn.bind(this);
    this.twoFactorChallenge = this.twoFactorChallenge.bind(this);
    this.signOut = this.signOut.bind(this);
    this.setUser = this.setUser.bind(this);
    this.checkAuthentication = this.checkAuthentication.bind(this);
  }

  csrf() {
    const { apiUrl, csrfCookieRoute } = this.props.config;
    return this.axios.get(`${apiUrl}/${csrfCookieRoute}`);
  }

  signIn(
    email: string,
    password: string,
    remember: boolean = false
  ): Promise<{ twoFactor: boolean; signedIn: boolean; user?: {} }> {
    const { apiUrl, signInRoute } = this.props.config;

    return new Promise(async (resolve, reject) => {
      try {
        // Get CSRF cookie.
        await this.csrf();

        // Sign in.
        const { data: signInData } = await this.axios.post(
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
        const user = await this.revalidate();

        return resolve({ twoFactor: false, signedIn: true, user });
      } catch (error) {
        return reject(error);
      }
    });
  }

  twoFactorChallenge(code: string, recovery: boolean = false): Promise<{}> {
    const { apiUrl, twoFactorChallengeRoute } = this.props.config;

    return new Promise(async (resolve, reject) => {
      try {
        // The user can either use their OTP token or use a recovery code.
        const formData = recovery ? { recovery_code: code } : { code };

        await this.axios.post(`${apiUrl}/${twoFactorChallengeRoute}`, formData);

        // Fetch user.
        const user = await this.revalidate();

        return resolve(user);
      } catch (error) {
        return reject(error);
      }
    });
  }

  signOut() {
    const { apiUrl, signOutRoute } = this.props.config;

    return new Promise<void>(async (resolve, reject) => {
      try {
        await this.axios.post(`${apiUrl}/${signOutRoute}`);
        // Only sign out after the server has successfully responded.
        this.setState({ user: null, authenticated: false });
        resolve();
      } catch (error) {
        return reject(error);
      }
    });
  }

  setUser(user: object, authenticated: boolean = true) {
    this.setState({ user, authenticated });
  }

  revalidate(): Promise<boolean | { user: {} }> {
    return new Promise(async (resolve, reject) => {
      const { apiUrl, userObjectRoute } = this.props.config;

      try {
        const { data } = await this.axios.get(`${apiUrl}/${userObjectRoute}`, {
          maxRedirects: 0,
        });

        this.setUser(data);

        resolve(data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          // If there's a 401 error the user is not signed in.
          this.setState({ user: null, authenticated: false });
          return resolve(false);
        } else {
          // If there's any other error, something has gone wrong.
          return reject(error);
        }
      }
    });
  }

  checkAuthentication(): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      if (this.state.authenticated === null) {
        // The status is null if we haven't checked it, so we have to make a request.
        try {
          await this.revalidate();
          return resolve(true);
        } catch (error) {
          if (error.response && error.response.status === 401) {
            // If there's a 401 error the user is not signed in.
            this.setState({ user: null, authenticated: false });
            return resolve(false);
          } else {
            // If there's any other error, something has gone wrong.
            return reject(error);
          }
        }
      } else {
        // If it has been checked with the server before, we can just return the state.
        return resolve(this.state.authenticated);
      }
    });
  }

  componentDidMount() {
    if (this.props.checkOnInit) {
      this.checkAuthentication();
    }
  }

  render() {
    return (
      <SanctumContext.Provider
        children={this.props.children || null}
        value={{
          user: this.state.user,
          authenticated: this.state.authenticated,
          signIn: this.signIn,
          twoFactorChallenge: this.twoFactorChallenge,
          signOut: this.signOut,
          setUser: this.setUser,
          checkAuthentication: this.checkAuthentication,
        }}
      />
    );
  }
}

export default Sanctum;
