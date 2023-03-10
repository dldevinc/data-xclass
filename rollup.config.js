const resolve = require("@rollup/plugin-node-resolve");
const babel = require("@rollup/plugin-babel");
const commonjs = require("@rollup/plugin-commonjs");
const pkg = require("./package.json");

module.exports = {
	input: "src/index.js",
	plugins: [
		commonjs(),
		babel({ babelHelpers: 'bundled' }),
		resolve(),
	],
	output: [
		{
			file: pkg.main,
			format: "cjs"
		},
		{
			name: "XClass",
			file: "dist/umd.js",
			format: "umd"
		},
	],
}
