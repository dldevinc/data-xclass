const resolve = require("@rollup/plugin-node-resolve");
const babel = require("@rollup/plugin-babel");
const commonjs = require("@rollup/plugin-commonjs");
const pkg = require("./package.json");

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
			file: pkg.main,
			format: "cjs",
		},
		{
			name: "XClass",
			file: "dist/umd.js",
			format: "umd",
			sourcemap: true,
		},
	],
}
