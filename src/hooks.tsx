import * as React from "react";
import invariant from "tiny-invariant";

import SanctumContext from "./SanctumContext";

const useContext = React.useContext;

export function useUser() {
  invariant(
    typeof useContext === "function",
    "You must use React >= 16.8 in order to use useUser()"
  );

  return useContext(SanctumContext).user;
}

export function useAuthenticated() {
  invariant(
    typeof useContext === "function",
    "You must use React >= 16.8 in order to use useAuthenticated()"
  );

  return useContext(SanctumContext).authenticated;
}
