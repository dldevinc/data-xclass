const resolve = require("@rollup/plugin-node-resolve");
const babel = require("@rollup/plugin-babel");
const commonjs = require("@rollup/plugin-commonjs");
const terser = require("@rollup/plugin-terser");

module.exports = [{
	input: "src/index.js",
	external: ["eventemitter3"],
	plugins: [
		commonjs(),
		babel({
			exclude: ["node_modules/**"],
			babelHelpers: "bundled"
		}),
	],
	output: [
		{
			file: "dist/cjs.js",
			format: "cjs",
		},
		{
			file: "dist/esm.js",
			format: "es",
		},
	],
}, {
	input: "src/index.js",
	plugins: [
		resolve(),
		commonjs(),
		babel({
			exclude: ["node_modules/**"],
			babelHelpers: "bundled"
		}),
	],
	output: [
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
			plugins: [
				terser()
			]
		},
	],
}]
