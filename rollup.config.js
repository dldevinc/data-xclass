const resolve = require("@rollup/plugin-node-resolve");
const babel = require("@rollup/plugin-babel");
const commonjs = require("@rollup/plugin-commonjs");
const terser = require("@rollup/plugin-terser");

module.exports = {
	input: "src/index.js",
	plugins: [
		resolve({
			resolveOnly: ["eventemitter3"]
		}),
		commonjs(),
		babel({ babelHelpers: 'bundled' }),
	],
	output: [
		{
			file: "dist/cjs.js",
			format: "cjs",
		},
		{
			file: "dist/cjs.min.js",
			format: "cjs",
			sourcemap: true,
			plugins: [terser()]
		},
		{
			name: "XClass",
			file: "dist/umd.js",
			format: "umd",
			sourcemap: true,
		},
		{
			name: "XClass",
			file: "dist/umd.min.js",
			format: "umd",
			sourcemap: true,
			plugins: [terser()]
		},
	],
}
