'use strict';

const path = require('path');
const webpack = require('webpack');
module.exports = {
    entry: {
        vendor: ['antd', 'react', 'react-dom']
    },
    output: {
        path: path.resolve(__dirname, 'dll'),
        filename: '[name].dll.js',
        library: '[name]_[chunkhash:5]'
    },
    resolve: {
        extensions: ['.js', '.json', '.jsx']
    },
    plugins: [
        new webpack.DllPlugin({
            context: path.join(__dirname, '.', 'dll'),
            path: path.join(__dirname, 'dll', '[name]-manifest.json'),
            name: '[name]_[chunkhash:5]'
        }),
    ]
};