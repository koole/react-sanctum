import React from "react";
import hoistStatics from "hoist-non-react-statics";
import invariant from "tiny-invariant";

import AirlockContext from "./AirlockContext";

const withAirlock = Component => {
  const C = props => {
    const displayName = `withRouter(${Component.displayName || Component.name})`;
    const { wrappedComponentRef, ...remainingProps } = props;

    return (
      <AirlockContext.Consumer>
        {context => {
          invariant(
            context,
            `You should not use <${displayName} /> outside a <Airlock>`
          );
          return (
            <Component
              {...remainingProps}
              {...context}
              ref={wrappedComponentRef}
            />
          );
        }}
      </AirlockContext.Consumer>
    );
  };
  return hoistStatics(C, Component);
};

export default withAirlock;

