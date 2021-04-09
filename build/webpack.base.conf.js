"use strict";
const path = require("path");
const utils = require("./utils");
const config = require("../config");
const webpack = require("webpack");
const vueLoaderConfig = require("./vue-loader.conf");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const { stage } = require("../config/base-url");
const { entry, generateHtmlWebpackPlugins } = require("../config/pages");

function resolve(dir) {
    return path.join(__dirname, "..", dir);
}

module.exports = {
    entry,
    context: path.resolve(__dirname, "../"),
    output: {
        path: config.build.assetsRoot,
        filename: "[name].js",
        publicPath: process.env.NODE_ENV === "production" ? config.build.assetsPublicPath : config.dev.assetsPublicPath,
    },
    resolve: {
        extensions: [".js", ".vue", ".json", ".ts"],
        alias: {
            vue$: "vue/dist/vue.esm.js",
            "@": resolve("src"),
            static: resolve("static"),
        },
    },
    plugins: [
        new VueLoaderPlugin(),
        new webpack.DefinePlugin({
            __ENV__: JSON.stringify(stage),
            __DEV__: JSON.stringify(stage === "development"),
        }),
        ...generateHtmlWebpackPlugins(),
    ],
    devtool: "source-map",
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: "vue-loader",
                options: vueLoaderConfig,
            },
            {
                test: /\.(ts|js)x?$/,
                exclude: /node_modules/,
                use: ["babel-loader"].concat(
                    process.env.NODE_ENV === "production"
                        ? []
                        : [
                              {
                                  loader: "cache-loader",
                              },
                              {
                                  loader: "thread-loader",
                                  options: {
                                      // there should be 1 cpu for the fork-ts-checker-webpack-plugin
                                      workers: require("os").cpus().length - 1,
                                  },
                              },
                          ],
                ),
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: "url-loader",
                options: {
                    limit: 10000,
                    name: utils.assetsPath("img/[name].[hash:7].[ext]"),
                },
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                loader: "url-loader",
                options: {
                    limit: 10000,
                    name: utils.assetsPath("media/[name].[hash:7].[ext]"),
                },
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: "url-loader",
                options: {
                    limit: 10000,
                    name: utils.assetsPath("fonts/[name].[hash:7].[ext]"),
                },
            },
        ],
    },
    node: {
        // prevent webpack from injecting useless setImmediate polyfill because Vue
        // source contains it (although only uses it if it's native).
        setImmediate: false,
        // prevent webpack from injecting mocks to Node native modules
        // that does not make sense for the client
        dgram: "empty",
        fs: "empty",
        net: "empty",
        tls: "empty",
        child_process: "empty",
    },
};
