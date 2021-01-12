import { ContextProps } from "./SanctumContext";
export default interface WithSanctumProps<UserObj> extends ContextProps {
    user: null | UserObj;
}
