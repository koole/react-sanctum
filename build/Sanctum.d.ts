import { AxiosInstance } from "axios";
import * as React from "react";
interface Props {
    config: {
        api_url: string;
        axios_instance?: AxiosInstance;
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
declare class Sanctum extends React.Component<Props, State> {
    static defaultProps: {
        checkOnInit: boolean;
    };
    axios: AxiosInstance;
    constructor(props: Props);
    signIn(email: string, password: string, remember?: boolean): Promise<{}>;
    signOut(): Promise<unknown>;
    setUser(user: object, authenticated?: boolean): void;
    checkAuthentication(): Promise<boolean>;
    componentDidMount(): void;
    render(): JSX.Element;
}
export default Sanctum;
