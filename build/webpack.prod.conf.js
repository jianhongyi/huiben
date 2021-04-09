"use strict";
const path = require("path");
const utils = require("./utils");
const webpack = require("webpack");
const config = require("../config");
const merge = require("webpack-merge");
const baseWebpackConfig = require("./webpack.base.conf");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSPlugin = require("optimize-css-assets-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

const env = require("../config/prod.env");

const webpackConfig = merge(baseWebpackConfig, {
    mode: "production",
    module: {
        rules: utils.styleLoaders({
            sourceMap: config.build.productionSourceMap,
            extract: true,
            usePostCSS: true,
        }),
    },
    devtool: config.build.productionSourceMap ? config.build.devtool : false,
    externals: {
        vue: "Vue",
        vuex: "Vuex",
    },
    output: {
        path: config.build.assetsRoot,
        filename: utils.assetsPath("js/[name].[contenthash:7].js"),
        chunkFilename: utils.assetsPath("js/[name].[contenthash:7].js"),
    },
    optimization: {
        splitChunks: {
            automaticNameMaxLength: 15,
            cacheGroups: {
                commons: {
                    chunks: "all",
                    minChunks: 2,
                    maxInitialRequests: 5, // The default limit is too small to showcase the effect
                    minSize: 0, // This is example is too small to create commons chunks
                },
                vendor: {
                    test: /node_modules/,
                    chunks: "all",
                    name: "vendor",
                    priority: 10,
                    enforce: true,
                },
            },
        },
        minimize: true,
        minimizer: [
            new TerserPlugin({
                extractComments: false,
                terserOptions: {
                    safari10: true,
                },
            }),
        ],
    },
    plugins: [
        // http://vuejs.github.io/vue-loader/en/workflow/production.html
        new webpack.DefinePlugin({
            "process.env": env,
        }),
        // extract css into its own file
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: "static/css/[name].[contenthash:7].css",
            chunkFilename: "static/css/[name].[contenthash:7].css",
        }),
        // Compress extracted CSS. We are using this plugin so that possible
        // duplicated CSS from different components can be deduped.
        new OptimizeCSSPlugin({
            cssProcessorOptions: config.build.productionSourceMap
                ? { safe: true, map: { inline: false } }
                : { safe: true },
        }),
        // keep module.id stable when vendor modules does not change
        new webpack.HashedModuleIdsPlugin(),
        // enable scope hoisting
        new webpack.optimize.ModuleConcatenationPlugin(),
        // copy custom static assets
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, "../static"),
                to: config.build.assetsSubDirectory,
                ignore: [".*"],
            },
        ]),
    ],
});

if (config.build.productionGzip) {
    const CompressionWebpackPlugin = require("compression-webpack-plugin");

    webpackConfig.plugins.push(
        new CompressionWebpackPlugin({
            asset: "[path].gz[query]",
            algorithm: "gzip",
            test: new RegExp("\\.(" + config.build.productionGzipExtensions.join("|") + ")$"),
            threshold: 10240,
            minRatio: 0.8,
        }),
    );
}

if (config.build.bundleAnalyzerReport) {
    const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
    webpackConfig.plugins.push(new BundleAnalyzerPlugin());
}

module.exports = webpackConfig;
