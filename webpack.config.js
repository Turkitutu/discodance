const path = require('path'),
      TerserPlugin = require('terser-webpack-plugin');

require('dotenv').config();

module.exports = {
    mode: "production",
    entry: "./client/main.js",
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, process.env.WEBSITE_REPO_PATH, 'public')
    },
    optimization: {
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    ecma: 8,
                    mangle: {
                        reserved: [],
                        toplevel: true,
                        properties: {
                            builtins: true,
                            debug: ""
                        }
                    }
                }
            })
        ]
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    }
}