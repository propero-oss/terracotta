const fs = require('fs');
const path = require('path');
const pkg = require('./package.json');
const tsc = require('./tsconfig.json');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

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
    extensions: [".ts",".tsx",".js",".jsx",".json"],
    plugins: [
      new TsconfigPathsPlugin({})
    ]
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
  plugins: [
    new DtsBundlePlugin(),
    new RemoveEmptyDirsPlugin(),
    new DtsRemoveTsPathImportsPlugin()
  ]
};


function DtsBundlePlugin(){}
DtsBundlePlugin.prototype.apply = function (compiler) {
  compiler.plugin('done', function(){
    const dts = require('dts-bundle');
    dts.bundle({
      name: pkg.name,
      main: pkg.types,
      out: '../' + pkg.types,
      indent: '  ',
      newline: '\n',
      removeSource: true,
      outputAsModuleFolder: true // to use npm in-package typings
    });
  });
};


function RemoveEmptyDirsPlugin(){}
RemoveEmptyDirsPlugin.prototype.apply = function(compiler) {
  const removeEmpty = require('remove-empty-directories');
  compiler.plugin('done', function() {
    removeEmpty(paths.dist);
  });
};

function DtsRemoveTsPathImportsPlugin(){}
DtsRemoveTsPathImportsPlugin.prototype.apply = function(compiler) {
  compiler.plugin('done', function() {
    const regexBase = "import\\s+[^\"'`]*[\"'`]MODULEBASE[^\"'`]*[\"'`]\s*;?[\s]*";
    const regexes = Object.keys(tsc.compilerOptions.paths).map(path => {
      return new RegExp(regexBase.replace("MODULEBASE", path.replace('*', '').replace(/\\/g, "\\\\$0")), "g");
    });
    const dtsSource = fs.readFileSync(pkg.types).toString('utf8');
    const stripped = regexes.reduce((src, regex) => src.replace(regex, ''), dtsSource);
    fs.writeFileSync(pkg.types, stripped);
  })
};

