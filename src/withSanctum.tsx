import * as React from "react";
import invariant from "tiny-invariant";
import SanctumContext from "./SanctumContext";

const withSanctum = (Component) => {
  const displayName = `withSanctum(${Component.displayName || Component.name})`;

  const C = (props) => {
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
