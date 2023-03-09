const path = require("path");

module.exports = {
  entry: "./src/index.js",
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
    filename: "data-xclass.js",
    library: "XClass",
    libraryExport: "default",
    libraryTarget: "umd",
  }
};
