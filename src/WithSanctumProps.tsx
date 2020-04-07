export default interface WithSanctumProps<UserObj> {
  user: null | UserObj;
  authenticated: null | boolean;
  signIn: (email: string, password: string) => Promise<{}>;
  signOut: () => void;
  setUser: (user: object, authenticated?: boolean) => void;
  checkAuthentication: () => Promise<boolean>;
}
