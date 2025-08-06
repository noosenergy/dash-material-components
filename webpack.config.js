const path = require('path');
const WebpackDashDynamicImport = require('@plotly/webpack-dash-dynamic-import');
const webpack = require('webpack');
const packagejson = require('./package.json');

const dashLibraryName = packagejson.name.replace(/-/g, '_');

/**
 * Webpack configuration for the Dash Material Components library.
 *
 * Inspired by dash-core-components/webpack.config.js
 *
 * @param {Object} env - Environment variables
 * @param {Object} argv - Command line arguments
 * @returns {Object} Webpack configuration
 */
module.exports = function (env, argv) {
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

  const entry = overrides.entry || {main: './src/index.ts'};

  const externals =
    'externals' in overrides
      ? overrides.externals
      : {
          react: 'React',
          'react-dom': 'ReactDOM',
          'prop-types': 'PropTypes'
        };

  return {
    mode,
    entry,
    target: ['web', 'es5'],
    output: {
      path: path.resolve(__dirname, dashLibraryName),
      chunkFilename: '[name].js',
      filename,
      library: {
        name: dashLibraryName,
        type: 'window'
      }
    },
    externals,
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.json']
    },
    // Module rules
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/
        },
        {
          test: /\.css$/,
          use: [
            {
              loader: 'style-loader',
              options: {
                insert: function insertAtTop(element) {
                  var parent = document.querySelector('head');
                  var lastInsertedElement = window._lastElementInsertedByStyleLoader;

                  if (!lastInsertedElement) {
                    parent.insertBefore(element, parent.firstChild);
                  } else if (lastInsertedElement.nextSibling) {
                    parent.insertBefore(element, lastInsertedElement.nextSibling);
                  } else {
                    parent.appendChild(element);
                  }

                  window._lastElementInsertedByStyleLoader = element;
                }
              }
            },
            {
              loader: 'css-loader'
            }
          ]
        }
      ]
    },
    // Optimization
    optimization: {
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
            name: `${dashLibraryName}-shared`
          }
        }
      }
    },
    // Plugins
    plugins: [
      new WebpackDashDynamicImport(),
      new webpack.SourceMapDevToolPlugin({
        filename: '[file].map',
        exclude: ['async-plotlyjs', 'async-mathjax']
      })
    ]
  };
};
