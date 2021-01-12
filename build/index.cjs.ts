'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var axios = require('axios');
var React = require('react');
var invariant = require('tiny-invariant');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var axios__default = /*#__PURE__*/_interopDefaultLegacy(axios);
var invariant__default = /*#__PURE__*/_interopDefaultLegacy(invariant);

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

var SanctumContext = React.createContext({});

axios__default['default'].defaults.withCredentials = true;
var Sanctum = /** @class */ (function (_super) {
    __extends(Sanctum, _super);
    function Sanctum(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            user: null,
            authenticated: null,
        };
        _this.axios = props.config.axios_instance || axios__default['default'].create();
        _this.signIn = _this.signIn.bind(_this);
        _this.signOut = _this.signOut.bind(_this);
        _this.setUser = _this.setUser.bind(_this);
        _this.checkAuthentication = _this.checkAuthentication.bind(_this);
        return _this;
    }
    Sanctum.prototype.signIn = function (email, password, remember) {
        var _this = this;
        if (remember === void 0) { remember = false; }
        var _a = this.props.config, api_url = _a.api_url, csrf_cookie_route = _a.csrf_cookie_route, signin_route = _a.signin_route, user_object_route = _a.user_object_route;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var data, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        // Get CSRF cookie.
                        return [4 /*yield*/, this.axios.get(api_url + "/" + csrf_cookie_route)];
                    case 1:
                        // Get CSRF cookie.
                        _a.sent();
                        // Sign in.
                        return [4 /*yield*/, this.axios.post(api_url + "/" + signin_route, {
                                email: email,
                                password: password,
                                remember: remember ? true : null,
                            })];
                    case 2:
                        // Sign in.
                        _a.sent();
                        return [4 /*yield*/, this.axios.get(api_url + "/" + user_object_route)];
                    case 3:
                        data = (_a.sent()).data;
                        this.setState({ user: data, authenticated: true });
                        return [2 /*return*/, resolve(data)];
                    case 4:
                        error_1 = _a.sent();
                        return [2 /*return*/, reject(error_1)];
                    case 5: return [2 /*return*/];
                }
            });
        }); });
    };
    Sanctum.prototype.signOut = function () {
        var _this = this;
        var _a = this.props.config, api_url = _a.api_url, signout_route = _a.signout_route;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.axios.post(api_url + "/" + signout_route)];
                    case 1:
                        _a.sent();
                        // Only sign out after the server has successfully responded.
                        this.setState({ user: null, authenticated: false });
                        resolve(undefined);
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _a.sent();
                        return [2 /*return*/, reject(error_2)];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    Sanctum.prototype.setUser = function (user, authenticated) {
        if (authenticated === void 0) { authenticated = true; }
        this.setState({ user: user, authenticated: authenticated });
    };
    Sanctum.prototype.checkAuthentication = function () {
        var _this = this;
        var _a = this.props.config, api_url = _a.api_url, user_object_route = _a.user_object_route;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var data, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.state.authenticated === null)) return [3 /*break*/, 5];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.axios.get(api_url + "/" + user_object_route)];
                    case 2:
                        data = (_a.sent()).data;
                        this.setState({ user: data, authenticated: true });
                        return [2 /*return*/, resolve(true)];
                    case 3:
                        error_3 = _a.sent();
                        if (error_3.response && error_3.response.status === 401) {
                            // If there's a 401 error the user is not signed in.
                            this.setState({ user: null, authenticated: false });
                            return [2 /*return*/, resolve(false)];
                        }
                        else {
                            // If there's any other error, something has gone wrong.
                            return [2 /*return*/, reject(error_3)];
                        }
                    case 4: return [3 /*break*/, 6];
                    case 5: 
                    // If it has been checked with the server before, we can just return the state.
                    return [2 /*return*/, resolve(this.state.authenticated)];
                    case 6: return [2 /*return*/];
                }
            });
        }); });
    };
    Sanctum.prototype.componentDidMount = function () {
        if (this.props.checkOnInit) {
            this.checkAuthentication();
        }
    };
    Sanctum.prototype.render = function () {
        return (React.createElement(SanctumContext.Provider, { children: this.props.children || null, value: {
                user: this.state.user,
                authenticated: this.state.authenticated,
                signIn: this.signIn,
                signOut: this.signOut,
                setUser: this.setUser,
                checkAuthentication: this.checkAuthentication,
            } }));
    };
    Sanctum.defaultProps = {
        checkOnInit: true,
    };
    return Sanctum;
}(React.Component));

var withSanctum = function (Component) {
    var displayName = "withSanctum(" + (Component.displayName || Component.name) + ")";
    var C = function (props) {
        return (React.createElement(SanctumContext.Consumer, null, function (context) {
            invariant__default['default'](context, "You should not use <" + displayName + " /> outside a <Sanctum>");
            return React.createElement(Component, __assign({}, props, context));
        }));
    };
    C.displayName = displayName;
    return C;
};

exports.Sanctum = Sanctum;
exports.SanctumContext = SanctumContext;
exports.withSanctum = withSanctum;
//# sourceMappingURL=index.cjs.ts.map
