const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
    mode: "development",
    devtool: "cheap-module-source-map",
    entry: {
        index: "./src/index.js",
    },
    module: {
        rules: [{ test: /\.tsx?$/, use: "ts-loader", exclude: /node_modules/ }], // do not forget to change/install your own TS loader
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    plugins: [
        new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
        new HtmlWebpackPlugin({ template: "src/popup.html" }),
        new CopyWebpackPlugin({
            patterns: [
                { from: "./src/manifest.json" },
                {
                    from: "./src/icons/cookie-48.png",
                    to: "icons/cookie-48.png",
                },
                {
                    from: "./src/icons/cookie-128.png",
                    to: "icons/cookie-128.png",
                },
            ],
        }),
    ],
    output: { filename: "[name].js", path: path.resolve(__dirname, "dist") }, // chrome will look for files under dist/* folder
};
