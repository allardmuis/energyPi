var path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './build/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins:[
    //new webpack.optimize.UglifyJsPlugin({
    //  sourceMap: true
    //})
  ],
};

