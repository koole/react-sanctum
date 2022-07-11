import * as React from "react";

import SanctumContext, { ContextProps } from "./SanctumContext";

interface useSanctumReturn<T> extends ContextProps {
  user: T;
}

export default function useSanctum<T = null | any>(): useSanctumReturn<T> {
  const context = React.useContext(SanctumContext);
  if (!context)
    throw new Error("useSanctum should only be used inside <Sanctum />");
  return context;
};

