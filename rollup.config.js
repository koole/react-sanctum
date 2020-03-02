
import json from "@rollup/plugin-json";
import typescript from "rollup-plugin-typescript2";
import pkg from "./package.json";
// import resolve from "rollup-plugin-node-resolve";
// import commonjs from "rollup-plugin-commonjs";
// import externalGlobals from "rollup-plugin-external-globals";

export default [
  // browser-friendly UMD build
  //! Currently broken, so isn't included in package.json
  //   {
  //     input: "src/index.ts",
  //     output: {
  //       name: "react-airlock",
  //       file: pkg.browser,
  //       format: "umd"
  //     },
  //     external: ["react", "react-dom"],
  //     plugins: [
  //       resolve({ browser: true }),
  //       json(),
  //       commonjs(),
  //       typescript(),
  //       externalGlobals({
  //         react: "React"
  //       })
  //     ]
  //   },

  // CommonJS (for Node) and ES module (for bundlers) build.
  // (We could have three entries in the configuration array
  // instead of two, but it's quicker to generate multiple
  // builds from a single configuration where possible, using
  // an array for the `output` option, where we can specify
  // `file` and `format` for each target)
  {
    input: "src/index.ts",
    external: ["react", "axios", "hoist-non-react-statics", "tiny-invariant"],
    plugins: [json(), typescript()],
    output: [
      { file: pkg.main, format: "cjs", sourcemap: true },
      { file: pkg.module, format: "es", sourcemap: true }
    ]
  }
];
