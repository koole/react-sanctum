import * as React from "react";
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
declare class Airlock extends React.Component<Props, State> {
    static defaultProps: {
        checkOnInit: boolean;
    };
    constructor(props: Props);
    signIn(email: string, password: string): Promise<unknown>;
    signOut(): Promise<unknown>;
    checkAuthentication(): Promise<null | boolean>;
    componentDidMount(): void;
    render(): JSX.Element;
}
export default Airlock;
