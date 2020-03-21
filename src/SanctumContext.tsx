import * as React from "react";

export interface ContextProps {
  user: null | any;
  authenticated: null | boolean;
  signIn: (email: string, password: string) => Promise<unknown>;
  signOut: () => void;
  checkAuthentication: () => Promise<null | boolean>;
}

const SanctumContext = React.createContext<Partial<ContextProps>>({});

export default SanctumContext;
