const path = require("path");
const { merge } = require("webpack-merge");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const commonConfig = {
  entry: "./src/index.tsx",
  output: {
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "index.html",
    }),
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        diagnosticOptions: {
          semantic: true,
          syntactic: true,
        },
      },
    }),
    new MiniCssExtractPlugin({
      filename: "[name].[contenthash].css",
    }),
  ].filter(Boolean),
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/i,
        loader: "babel-loader",
        exclude: ["/node_modules/"],
      },
      {
        test: /\.s?css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              modules: {
                namedExport: false,
              },
            },
          },
          "sass-loader",
        ],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: "asset",
      },
    ],
  },
  mode: "production",
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", "..."],
  },
};

const esmConfig = merge(commonConfig, {
  output: {
    filename: "[name].mjs",
    library: {
      type: "module",
    },
  },
  experiments: {
    outputModule: true, // ESM 출력을 위해 필요합니다.
  },
  target: "web", // 대상 환경을 설정합니다.
});

const cjsConfig = merge(commonConfig, {
  output: {
    filename: "[name].cjs",
    library: {
      type: "commonjs2",
    },
  },
  target: "node", // Node.js 환경을 대상으로 합니다.
});

module.exports = [esmConfig, cjsConfig];
