var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import React from "react";
import hoistStatics from "hoist-non-react-statics";
import invariant from "tiny-invariant";
import AirlockContext from "./AirlockContext";
var withAirlock = function (Component) {
    var C = function (props) {
        var displayName = "withRouter(" + (Component.displayName || Component.name) + ")";
        var wrappedComponentRef = props.wrappedComponentRef, remainingProps = __rest(props, ["wrappedComponentRef"]);
        return (React.createElement(AirlockContext.Consumer, null, function (context) {
            invariant(context, "You should not use <" + displayName + " /> outside a <Airlock>");
            return (React.createElement(Component, __assign({}, remainingProps, context, { ref: wrappedComponentRef })));
        }));
    };
    return hoistStatics(C, Component);
};
export default withAirlock;
//# sourceMappingURL=withAirlock.js.map