import * as React from "react";

import SanctumContext from "./SanctumContext";

const useSanctum = () => {
  return React.useContext(SanctumContext);
};

export default useSanctum;
