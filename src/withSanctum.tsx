import * as React from "react";
import invariant from "tiny-invariant";

import SanctumContext from "./SanctumContext";
import WithSanctumProps from "./WithSanctumProps";

const withSanctum = (Component: React.ComponentType<WithSanctumProps<any>>) => {
  const displayName = `withSanctum(${Component.displayName || Component.name})`;
 
  const C = (props: WithSanctumProps<any>) => {
    return (
      <SanctumContext.Consumer>
        {(context) => {
          invariant(
            context,
            `You should not use <${displayName} /> outside a <Sanctum>`
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
