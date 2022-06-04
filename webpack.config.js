const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
    mode: "development",
    // Necessary for development build; else builds unsafe eval code which isn't allowed by chrome extensions
    devtool: "cheap-module-source-map",
    entry: {
        index: "./src/popup.js",
    },
    module: {
        rules: [{ test: /\.tsx?$/, use: "ts-loader", exclude: /node_modules/ }], // do not forget to change/install your own TS loader
        rules: [
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    plugins: [
        new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
        new HtmlWebpackPlugin({
            template: "src/popup.html",
            filename: "popup.html",
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: "./src/manifest.json" },
                {
                    from: "./src/assets/icons/icon48.png",
                },
                {
                    from: "./src/assets/icons/icon128.png",
                },
            ],
        }),
    ],
    output: { filename: "[name].js", path: path.resolve(__dirname, "dist") }, // chrome will look for files under dist/* folder
};
