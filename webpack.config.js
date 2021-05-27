var path = require('path');
const HtmlWebpackPlugin =  require('html-webpack-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');

const mode = process.env.NODE_ENV || "development";
const target = process.env.NODE_ENV || "web";

module.exports = {
    entry : './src/index.js',
    output: {
        path: path.resolve(__dirname, '/dist'),
        filename: 'index_bundle.js',
        publicPath: '/'
    },
    mode: mode,
    target: target,
    devtool: "source-map",
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        historyApiFallback: true,
        compress: true,
        host: '0.0.0.0',
        port: 3000,
        open: true,
        hot: true,
    },
    module : {
        rules : [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                  loader: "babel-loader",
                  options: {
                    presets: ["@babel/preset-env", "@babel/preset-react"],
                  },
                },
            },
            {
                test : /\.css$/, 
                exclude: /node_modules/,
                use:['style-loader', 'css-loader']
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif|ico|json)$/,
                exclude: /node_modules/,
                use: 'file-loader?name=[name].[ext]'
            }
        ]
    },
    plugins : [
        new HtmlWebpackPlugin ({
            template: './public/index.html',
            favicon: './public/favicon.ico'
        }),
        new WebpackManifestPlugin({
            basePath: './public',
            fileName: 'manifest.json'
        })
    ]
}
