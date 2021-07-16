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
    axiosInstance: axios.create()
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      user: null,
      authenticated: null,
    };

    this.axios = props.config.axiosInstance || axios.create();

    this.signIn = this.signIn.bind(this);
    this.signOut = this.signOut.bind(this);
    this.setUser = this.setUser.bind(this);
    this.checkAuthentication = this.checkAuthentication.bind(this);
  }

  signIn(
    email: string,
    password: string,
    remember: boolean = false
  ): Promise<{}> {
    const {
      apiUrl,
      csrfCookieRoute,
      signInRoute,
      userObjectRoute,
    } = this.props.config;

    return new Promise(async (resolve, reject) => {
      try {
        // Get CSRF cookie.
        await this.axios.get(`${apiUrl}/${csrfCookieRoute}`);
        // Sign in.
        await this.axios.post(`${apiUrl}/${signInRoute}`, {
          email,
          password,
          remember: remember ? true : null,
        });
        // When correct, get the user data.
        const { data } = await this.axios.get(`${apiUrl}/${userObjectRoute}`);
        this.setState({ user: data, authenticated: true });
        return resolve(data);
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

  checkAuthentication(): Promise<boolean> {
    const { apiUrl, userObjectRoute } = this.props.config;
    return new Promise(async (resolve, reject) => {
      if (this.state.authenticated === null) {
        // The status is null if we haven't checked it, so we have to make a request.
        try {
          const { data } = await this.axios.get(`${apiUrl}/${userObjectRoute}`);
          this.setState({ user: data, authenticated: true });
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
          signOut: this.signOut,
          setUser: this.setUser,
          checkAuthentication: this.checkAuthentication,
        }}
      />
    );
  }
}

export default Sanctum;
