import * as React from "react";

import SanctumContext from "./SanctumContext";

const useSanctum = () => {
  const context = React.useContext(SanctumContext);
  if (!context)
    throw new Error("useSanctum should only be used inside <Sanctum />");
  return context;
};

export default useSanctum;
