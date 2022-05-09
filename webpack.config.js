const path = require('path');
const webpack = require('webpack');
const WebpackDashDynamicImport = require('@plotly/webpack-dash-dynamic-import');

const packageJson = require('./package.json');
const libraryName = packageJson.name.replace(/-/g, '_');

module.exports = (env, argv) => {
  let mode;

  // if user specified mode flag take that value
  if (argv && argv.mode) {
    mode = argv.mode;
  }
  // else take webpack default (production)
  else {
    mode = 'production';
  }

  const config = {
    mode,
    entry: {
      main: './src/index.js'
    },
    output: {
      library: libraryName,
      libraryTarget: 'window',
      path: path.resolve(__dirname, libraryName),
      filename: `${libraryName}.js`
    },
    devtool: 'source-map',
    externals: {
      react: 'React',
      'react-dom': 'ReactDOM',
      'plotly.js': 'Plotly',
      'prop-types': 'PropTypes',
    },
    resolve: {
      extensions: ['.js', '.jsx'],
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)?$/,
          use: 'babel-loader',
          exclude: /node_modules/,
        },
      ],
    },
    optimization: {
      minimize: true
    },
    plugins: [
      new WebpackDashDynamicImport(),
      new webpack.SourceMapDevToolPlugin({
          filename: '[file].map',
          exclude: ['async-plotlyjs']
      })
    ]
  };

  return config;
};
