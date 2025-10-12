import webpack from 'webpack';
import {buildWebpack} from "./config/build/buildWebpack";
import path from "path";
import {BuildPaths,BuildMode} from "./config/build/types/types";

interface EnvVariables {
    mode?: BuildMode;
    analyzer?: boolean;
    port?: number;
}

export default (env: EnvVariables) => {

    const paths: BuildPaths = {
        output: path.resolve(__dirname, '../server/public'),
        entry: path.resolve(__dirname, 'src', 'index.js'),
        html: path.resolve(__dirname, 'public', 'index.html'),
        public: path.resolve(__dirname, 'public'),
        src: path.resolve(__dirname, 'src'),
    }

    const config: webpack.Configuration = buildWebpack({
        port: env.port ?? 3000,
        mode: env.mode ?? 'development',
        //mode: 'production',
        paths,
        analyzer: env.analyzer,
    })
    return config
};