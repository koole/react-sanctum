import * as React from "react";
import hoistStatics from "hoist-non-react-statics";
import invariant from "tiny-invariant";

import SanctumContext from "./SanctumContext";

const withSanctum = Component => {
  const C = props => {
    const displayName = `withRouter(${Component.displayName || Component.name})`;
    const { wrappedComponentRef, ...remainingProps } = props;

    return (
      <SanctumContext.Consumer>
        {context => {
          invariant(
            context,
            `You should not use <${displayName} /> outside a <Sanctum>`
          );
          return (
            <Component
              {...remainingProps}
              {...context}
              ref={wrappedComponentRef}
            />
          );
        }}
      </SanctumContext.Consumer>
    );
  };
  return hoistStatics(C, Component);
};

export default withSanctum;

