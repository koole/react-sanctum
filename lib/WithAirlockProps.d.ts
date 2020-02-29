export default interface WithAirlockProps<UserObj> {
    user: null | UserObj;
    authenticated: boolean;
    signIn: (email: string, password: string) => Promise<{}>;
    signOut: () => void;
    checkAuthentication: () => Promise<boolean>;
}
