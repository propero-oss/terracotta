const path = require('path');
const pkg = require('./package.json');

const paths = {
  src: './src',
  dist: './dist',
  entry: './src/index.ts',
  assets: './assets',
  example: './example'
};

Object.keys(paths).forEach(key => paths[key] = path.join(__dirname, paths[key]));


module.exports = {
  entry: paths.entry,
  mode: 'development',
  devtool: "inline-source-maps",
  output: {
    filename: 'index.js',
    path: paths.dist
  },
  devServer: {
    contentBase: paths.dist,
    compress: true,
    port: 9000,
    hot: true
  },
  resolve: {
    enforceExtension: false,
    extensions: [".ts",".tsx",".js",".jsx",".json"]
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  plugins: [new DtsBundlePlugin()]
};


function DtsBundlePlugin(){}
DtsBundlePlugin.prototype.apply = function (compiler) {
  compiler.plugin('done', function(){
    const dts = require('dts-bundle');
    const removeEmpty = require('remove-empty-directories');
    dts.bundle({
      name: pkg.name,
      main: pkg.types,
      out: '../' + pkg.types,
      indent: '  ',
      newline: '\n',
      removeSource: true,
      outputAsModuleFolder: false // to use npm in-package typings
    });
    removeEmpty(paths.dist);
  });
};
