var path = require('path');
const HtmlWebpackPlugin =  require('html-webpack-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');

module.exports = {
    entry : './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'index_bundle.js',
        publicPath: '/'
    },
    module : {
        rules : [
            {
                test : /\.(js)$/, 
                use:'babel-loader'
            },
            {
                test : /\.css$/, 
                use:['style-loader', 'css-loader']
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif|ico|json)$/,
                exclude: /node_modules/,
                use: 'file-loader?name=[name].[ext]'
            }
        ]
    },
    mode:'development',
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        historyApiFallback: true,
        compress: true,
        host: '0.0.0.0',
        port: 3000,
        hot: true,
    },
    plugins : [
        new HtmlWebpackPlugin ({
            template: './public/index.html',
            filename: './index.html',
            favicon: './public/favicon.ico'
        }),
        new WebpackManifestPlugin({
            basePath: './public/',
            fileName: 'manifest.json'
        })
    ]
}