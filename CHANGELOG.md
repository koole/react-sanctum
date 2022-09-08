# Changelog
All notable changes to this project will be documented in this file.

## [2.3.0]
- Add support for React 18

## [2.2.0]
- Add `usernameKey` configuration option (#151)
- Fix incorrect type (#150)

## [2.1.3]
- Fix signOut promise return type (#122)

## [2.1.0]
- Removed tiny-invariant dependency

## [2.0.0]
- ⚠️ Configuration settings have been changed to camelcase.
```diff
+   apiUrl: "http://foobar.test",
+   csrfCookieRoute: "sanctum/csrf-cookie",
+   signInRoute: "login",
+   signOutRoute: "logout",
+   userObjectRoute: "user",
-   api_url: "http://foobar.test",
-   csrf_cookie_route: "sanctum/csrf-cookie",
-   signin_route: "logout",
-   signout_route: "logout",
-   user_object_route: "user",
```

- Target build is now ES6, was ES5 previously.
- Now depends on an axios version higher than 0.21.1

## [1.0.1] - 2020-4-17

### Changed
- Add React 17 to peerdependencies

## [1.0.0] - 2020-4-17

### Changed
- Version bump only, no code changes

## [0.0.9] - 2020-4-17

### Added
- Optional "Remember me" option for signIn

## [0.0.8] - 2020-4-15

### Changed
- Fix incorrect properties for TypeScript 

## [0.0.7] - 2020-4-15

### Changed
- Fixed TypeScript interfaces, enabled strict mode.
