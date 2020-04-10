import * as React from "react";
import invariant from "tiny-invariant";
import SanctumContext from "./SanctumContext";

interface Options {
  withRef?: boolean;
}

const withSanctum = <P extends {}>(Component: React.ComponentType<P>, options: Options) => {
  const displayName = `withSanctum(${Component.displayName || Component.name})`;

  const C = ({ forwardedRef, ...newProps }) => {
    if (options.withRef && forwardedRef) {
      newProps.ref = forwardedRef;
    }
    return (
      <SanctumContext.Consumer>
        {(context) => {
          invariant(
            context,
            `You should not use <${displayName} /> outside a <Sanctum>`
          );
          return <Component ref={forwardedRef} {...newProps} {...context} />;
        }}
      </SanctumContext.Consumer>
    );
  };

  C.displayName = displayName;

  return React.forwardRef((props, ref) => {
    return <C {...props} forwardedRef={ref} />;
  });
};

export default withSanctum;
