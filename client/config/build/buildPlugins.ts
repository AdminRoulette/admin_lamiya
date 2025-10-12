import {Configuration} from "webpack";
import HtmlWebPackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import {BuildOptions} from "./types/types";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import path from "path";
import ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin";
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');

export function buildPlugins({mode, paths, analyzer}: BuildOptions): Configuration['plugins'] {

      const isProd = mode === 'production'
      const isDev = mode === 'development'


    const plugins: Configuration['plugins'] = [
        new ForkTsCheckerWebpackPlugin(),
    ]

    if (isDev) {
        plugins.push(new HtmlWebPackPlugin({
            template: paths.html,
            favicon: path.resolve(paths.public, 'favicon.ico')
        }))
        plugins.push(new ReactRefreshWebpackPlugin())
    }

    if (isProd) {
        plugins.push(new HtmlWebPackPlugin({
            //jsExtension: ".gz",
            template: paths.html,
            favicon: path.resolve(paths.public, 'favicon.ico')
        }))
        //plugins.push(new HtmlWebpackChangeAssetsExtensionPlugin())
        plugins.push(new MiniCssExtractPlugin({
            filename: 'css/[name].[contenthash:5].css',
            chunkFilename: 'css/[name].[contenthash:5].css'
        }))
        // plugins.push(new CompressionPlugin({
        //     minRatio: 0.9,
        //     algorithm: "gzip",
        //     test: /.js$/,
        // }))
    }

    if (analyzer) {
        plugins.push(new BundleAnalyzerPlugin())
    }
    return plugins
}