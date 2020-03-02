/// <reference types="react" />
import hoistStatics from "hoist-non-react-statics";
declare const withAirlock: (Component: any) => ((props: any) => JSX.Element) & hoistStatics.NonReactStatics<any, {}>;
export default withAirlock;
