const path = require("path");

module.exports = {
  entry: {
    bundle: "./build/module.js",
    cdn: "./build/cdn.js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /[\\/]node_modules[\\/]/,
        use: [
          {
            loader: "babel-loader",
            options: {
              cacheDirectory: path.resolve(__dirname, "cache")
            }
          },
        ],
      }
    ]
  },
  output: {
    path: path.join(__dirname, "/dist"),
    publicPath: "/",
    filename: "[name].js"
  }
};
