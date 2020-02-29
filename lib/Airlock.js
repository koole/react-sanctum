var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import React from "react";
import axios from "axios";
import AirlockContext from "./AirlockContext";
axios.defaults.withCredentials = true;
var Airlock = /** @class */ (function (_super) {
    __extends(Airlock, _super);
    function Airlock(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            user: null,
            authenticated: null
        };
        _this.signIn = _this.signIn.bind(_this);
        _this.signOut = _this.signOut.bind(_this);
        _this.checkAuthentication = _this.checkAuthentication.bind(_this);
        return _this;
    }
    Airlock.prototype.signIn = function (email, password) {
        var _this = this;
        var _a = this.props.config, api_url = _a.api_url, csrf_cookie_route = _a.csrf_cookie_route, login_route = _a.login_route, user_object_route = _a.user_object_route;
        return new Promise(function (resolve, reject) {
            // Get CSRF cookie
            axios.get(api_url + "/" + csrf_cookie_route).then(function () {
                // Post user credentials
                axios
                    .post(api_url + "/" + login_route, {
                    email: email,
                    password: password
                })
                    .then(function () {
                    // When correct. get the user data
                    axios.get(api_url + "/" + user_object_route).then(function (_a) {
                        var data = _a.data;
                        _this.setState({ user: data, authenticated: true });
                        return resolve();
                    });
                })
                    .catch(function (error) {
                    return reject(error);
                });
            });
        });
    };
    Airlock.prototype.signOut = function () {
        // TODO: Actually log out
        this.setState({ user: null, authenticated: false });
    };
    Airlock.prototype.checkAuthentication = function () {
        var _this = this;
        var _a = this.props.config, api_url = _a.api_url, user_object_route = _a.user_object_route;
        return new Promise(function (resolve, reject) {
            if (_this.state.authenticated === null) {
                axios
                    .get(api_url + "/" + user_object_route)
                    .then(function (_a) {
                    var data = _a.data;
                    _this.setState({ user: data, authenticated: true });
                    return resolve(true);
                })
                    .catch(function (error) {
                    if (error.response.status === 401) {
                        _this.setState({ user: null, authenticated: false });
                        return resolve(false);
                    }
                    else {
                        return reject(error);
                    }
                });
            }
            else {
                return resolve(_this.state.authenticated);
            }
        });
    };
    Airlock.prototype.componentDidMount = function () {
        if (this.props.checkOnInit) {
            this.checkAuthentication();
        }
    };
    Airlock.prototype.render = function () {
        return (React.createElement(AirlockContext.Provider, { children: this.props.children || null, value: {
                user: this.state.user,
                authenticated: this.state.authenticated,
                signIn: this.signIn,
                signOut: this.signOut,
                checkAuthentication: this.checkAuthentication
            } }));
    };
    Airlock.defaultProps = {
        checkOnInit: true
    };
    return Airlock;
}(React.Component));
export default Airlock;
//# sourceMappingURL=Airlock.js.map