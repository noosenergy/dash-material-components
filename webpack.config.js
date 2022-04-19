const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const WebpackDashDynamicImport = require('@plotly/webpack-dash-dynamic-import');

const packagejson = require('./package.json');

const dashLibraryName = packagejson.name.replace(/-/g, '_');

module.exports = (env, argv) => {

  let mode;

  const overrides = module.exports || {};

  // if user specified mode flag take that value
  if (argv && argv.mode) {
    mode = argv.mode;
  }

  // else if configuration object is already set (module.exports) use that value
  else if (overrides.mode) {
    mode = overrides.mode;
  }

  // else take webpack default (production)
  else {
    mode = 'production';
  }

  let filename = (overrides.output || {}).filename;
  if (!filename) {
      filename = `${dashLibraryName}.js`;
  }

  const entry = overrides.entry || {main: './src/index.js'};

  const devtool = overrides.devtool || 'source-map';

  const externals = ('externals' in overrides) ? overrides.externals : ({
    react: 'React',
    'react-dom': 'ReactDOM',
    'plotly.js': 'Plotly',
    'prop-types': 'PropTypes',
  });

  return {
    mode,
    entry,
    output: {
      path: path.resolve(__dirname, dashLibraryName),
      chunkFilename: '[name].js',
      filename,
      library: dashLibraryName,
      libraryTarget: 'window',
    },
    devtool,
    externals,
    // resolve relative file import for extensions
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
      minimizer: [
        new TerserPlugin({
          sourceMap: true,
          parallel: true,
          cache: './.build_cache/terser',
          terserOptions: {
            warnings: false,
            ie8: false
          }
        })
      ],
      splitChunks: {
        name: '[name].js',
        cacheGroups: {
          async: {
            chunks: 'async',
            minSize: 0,
            name(module, chunks, cacheGroupKey) {
                return `${cacheGroupKey}-${chunks[0].name}`;
            }
          },
          shared: {
            chunks: 'all',
            minSize: 0,
            minChunks: 2,
            name: 'dash_mdc_neptune-shared'
          }
        }
      }
    },
    plugins: [
      new WebpackDashDynamicImport(),
      new webpack.SourceMapDevToolPlugin({
          filename: '[file].map',
          exclude: ['async-plotlyjs']
      })
    ]
  }
};
