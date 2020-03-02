export default interface WithAirlockProps<UserObj> {
  user: null | UserObj;
  authenticated: null | boolean;
  signIn: (email: string, password: string) => Promise<{}>;
  signOut: () => void;
  checkAuthentication: () => Promise<boolean>;
}
