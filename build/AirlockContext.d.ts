import * as React from "react";
export interface ContextProps {
    user: null | any;
    authenticated: null | boolean;
    signIn: (email: string, password: string) => Promise<unknown>;
    signOut: () => void;
    checkAuthentication: () => Promise<null | boolean>;
}
declare const AirlockContext: React.Context<Partial<ContextProps>>;
export default AirlockContext;
