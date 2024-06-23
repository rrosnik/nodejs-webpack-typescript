'use strict';
const path = require('path');

const libraryName = 'name-of-package';

/** @type {import('webpack').Configuration} */
module.exports = {
    target: 'node',
    entry: './src/index.ts',
    context: path.resolve(__dirname),
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'index.js',
        library: {
            type: 'commonjs2',
        },
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    devtool: 'source-map',
    plugins: [
        function () {
            this.hooks.done.tap({
                name: "dts-bundler"
            }, stats => {
                var dts = require('dts-bundle');
                dts.bundle({
                    name: libraryName,
                    main: './dist/types/index.d.ts',
                    out: '../index.d.ts',
                    removeSource: true,
                    outputAsModuleFolder: true // to use npm in-package typings
                });
            })
        },
        // new TypedocWebpackPlugin({ out: './docs', entryPoints: ['./src/index.ts'] })
    ],

    devServer: {
        static: {
            directory: path.join(__dirname, 'public'),
        },
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 9000
    }
}
