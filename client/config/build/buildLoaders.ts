import {ModuleOptions} from "webpack";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import ReactRefreshTypeScript from "react-refresh-typescript";
import {BuildOptions} from "./types/types";
import {buildBabelLoader} from "./buildBabelLoader";

export function buildLoaders(options: BuildOptions): ModuleOptions['rules'] {
    const isDev = options.mode === 'development';
    const assetLoader = {
        test: /\.(png|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
    }

    const svgrLoader = {
        test: /\.svg$/i,
        use: [
            {
                loader: '@svgr/webpack',
                options: {
                    icon: true,
                    svgoConfig: {
                        plugins: [
                            {
                                name: 'convertColors',
                                params: {
                                    currentColor: true,
                                }
                            }
                        ]
                    }
                }
            }
        ],
    }

    const cssLoaderWithModules = {
        loader: "css-loader",
        options: {
            sourceMap: isDev
        },
    }

    const fontLoader = {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
    }

    const scssModelLoader = {
        test: /\.module.(sc|sa)ss$/,
        use: [
            isDev ? "style-loader" : MiniCssExtractPlugin.loader,
            {
                loader: "css-loader",
                options: {
                    modules:
                        {localIdentName: isDev ? "[local]_[hash:base64:8]" : "[hash:base64:8]"}
                },
            },
            "sass-loader",
        ],
    }
    const scssLoader = {
        test: /^(?!.*\.module\.scss$).*\.scss$/,
        use: [
            isDev ? "style-loader" : MiniCssExtractPlugin.loader,
            {
                loader: "css-loader",
            },
            "sass-loader",
        ],
    }

    const cssLoader = {
        test: /\.css$/,
        use: [
            isDev ? "style-loader" : MiniCssExtractPlugin.loader,
            {
                loader: "css-loader",
            }
        ],
    }


    const tsLoader = {
        exclude: /node_modules/,
        test: /\.tsx?$/,
        use: [
            {
                loader: 'ts-loader',
                options: {
                    transpileOnly: true,
                    getCustomTransformers: () => ({
                        before: [isDev && ReactRefreshTypeScript()].filter(Boolean),
                    }),
                }
            }
        ]
    }
    const jsLoader = {
        test: /(\.js|\.ts|\.tsx)$/,
        loader: 'babel-loader',
        options: {
            presets: [
                '@babel/preset-react',
                '@babel/preset-typescript',
                [
                    '@babel/preset-env',
                    {
                        exclude: [/transform-async-to-generator/, /transform-regenerator/]
                    }
                ]
            ],
            plugins: ['@babel/plugin-proposal-class-properties']
        }
    };


    const babelLoader = buildBabelLoader(options);

    return [
        //tsLoader,
        //babelLoader,
        scssModelLoader,
        scssLoader,
        jsLoader,
        fontLoader,
        assetLoader,
        svgrLoader,
        cssLoader,
    ]
}