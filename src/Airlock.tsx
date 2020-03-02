import * as React from "react";
import axios from "axios";
import AirlockContext from "./AirlockContext";
axios.defaults.withCredentials = true;

interface Props {
  config: {
    api_url: string;
    csrf_cookie_route: string;
    signin_route: string;
    signout_route: string;
    user_object_route: string;
  };
  checkOnInit?: boolean;
}

interface State {
  user: null | {};
  authenticated: null | boolean;
}

class Airlock extends React.Component<Props, State> {
  static defaultProps = {
    checkOnInit: true
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      user: null,
      authenticated: null
    };

    this.signIn = this.signIn.bind(this);
    this.signOut = this.signOut.bind(this);
    this.checkAuthentication = this.checkAuthentication.bind(this);
  }

  signIn(email: string, password: string) {
    const {
      api_url,
      csrf_cookie_route,
      signin_route,
      user_object_route
    } = this.props.config;

    return new Promise((resolve, reject) => {
      // Get CSRF cookie
      axios.get(`${api_url}/${csrf_cookie_route}`).then(() => {
        // Post user credentials
        axios
          .post(`${api_url}/${signin_route}`, {
            email,
            password
          })
          .then(() => {
            // When correct. get the user data
            axios.get(`${api_url}/${user_object_route}`).then(({ data }) => {
              this.setState({ user: data, authenticated: true });
              return resolve();
            });
          })
          .catch(error => {
            return reject(error);
          });
      });
    });
  }

  signOut() {
    const {
      api_url,
      signout_route,
    } = this.props.config;
    // TODO: Actually log out
    return new Promise((resolve, reject) => {
      this.setState({ user: null, authenticated: false });
      axios
        .post(`${api_url}/${signout_route}`)
        .then(() => resolve())
        .catch(error => {
          return reject(error);
        });
    });
  }

  checkAuthentication(): Promise<null | boolean> {
    const { api_url, user_object_route } = this.props.config;
    return new Promise((resolve, reject) => {
      if (this.state.authenticated === null) {
        axios
          .get(`${api_url}/${user_object_route}`)
          .then(({ data }) => {
            this.setState({ user: data, authenticated: true });
            return resolve(true);
          })
          .catch(error => {
            if (error.response.status === 401) {
              this.setState({ user: null, authenticated: false });
              return resolve(false);
            } else {
              return reject(error);
            }
          });
      } else {
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
      <AirlockContext.Provider
        children={this.props.children || null}
        value={{
          user: this.state.user,
          authenticated: this.state.authenticated,
          signIn: this.signIn,
          signOut: this.signOut,
          checkAuthentication: this.checkAuthentication
        }}
      />
    );
  }
}

export default Airlock;
