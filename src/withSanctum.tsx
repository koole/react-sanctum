import * as React from "react";

import SanctumContext from "./SanctumContext";

const withSanctum = (Component: React.ComponentType<any>) => {
  const displayName = `withSanctum(${Component.displayName || Component.name})`;

  const C = (props: any) => {
    return (
      <SanctumContext.Consumer>
        {(context) => {
          if (!context)
            throw new Error(
              `<${displayName} /> should only be used inside <Sanctum />`
            );
          return <Component {...props} {...context} />;
        }}
      </SanctumContext.Consumer>
    );
  };

  C.displayName = displayName;

  return C;
};

export default withSanctum;
