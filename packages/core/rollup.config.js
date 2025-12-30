const typescript = require("@rollup/plugin-typescript")
const peerDepsExternal = require("rollup-plugin-peer-deps-external")
const resolve = require("@rollup/plugin-node-resolve")
const commonjs = require("@rollup/plugin-commonjs")
const { terser } = require("rollup-plugin-terser")
const postcss = require("rollup-plugin-postcss")

module.exports = {
  input: "src/index.ts",
  output: [
    {
      file: "dist/index.cjs.js",
      format: "cjs",
      sourcemap: true,
    },
    {
      file: "dist/index.esm.js",
      format: "esm",
      sourcemap: true,
    },
  ],
  plugins: [
    peerDepsExternal(),
    resolve({
      browser: true,
      preferBuiltins: false,
    }),
    commonjs(),
    postcss({
      extract: "styles.css",
      minimize: true,
      sourceMap: true,
    }),
    typescript({
      tsconfig: "./tsconfig.json",
      declaration: true,
      declarationDir: "dist/types",
      sourceMap: true,
      exclude: ["**/*.test.*", "**/*.stories.*"],
      outputToFilesystem: false,
    }),
    terser({
      compress: {
        drop_console: true,
      },
    }),
  ],
  external: ["react", "react-dom", "react/jsx-runtime"],
}
