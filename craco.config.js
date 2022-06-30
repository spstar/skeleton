const CracoLessPlugin = require('craco-less');
const CracoAlias = require('craco-alias');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const {when, whenDev, whenProd} = require('@craco/craco');
const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const packagesJson = require('./package.json');

function generateRegFromArr(arr) {
  return new RegExp('[\\\\/]node_modules[\\\\/](' + arr.join('|') + ')', 'i');
}

function generateCacheGroups(groups) {
  let retOptions = {};

  if (Array.isArray(groups)) {
    groups.forEach((it, idx) => {
      retOptions[String(idx)] = Array.isArray(it)
        ? {
          test: generateRegFromArr(it),
          chunks: 'all',
          enforce: true,
          priority: 999 - idx
        }
        : it;
    });
  }

  return retOptions;
}

// About `buffer` `crypto` `stream` `assert` `http` `https` `os`; That's options for fixed the issues, more info
// see https://github.com/ChainSafe/web3.js#troubleshooting-and-known-issues
module.exports = {
  webpack: {
    configure(webpackConfig, {env: webpackEnv, paths}) {
      if (webpackEnv !== 'production') {
        return webpackConfig;
      }

      webpackConfig.optimization.splitChunks = {
        ...webpackConfig.optimization.splitChunks,
        chunks: 'all',
        cacheGroups: generateCacheGroups(packagesJson.splitCacheGroups?.groups)
      };

      return webpackConfig;
    },
    plugins: [
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
        process: 'process/browser'
      }),
      ...whenProd(
        () => [
          new UglifyJsPlugin({
            cache: true,
            parallel: true,
            uglifyOptions: {
              warnings: false,
              compress: {
                drop_console: true,
                drop_debugger: true
              }
            }
          }),
          ...(process.env.ANALYSIS_BUNDLE === 'true'
            ? [new BundleAnalyzerPlugin()]
            : [])
        ],
        []
      )
    ]
  },
  // all options see:
  // https://webpack.js.org/configuration/dev-server/#devserverproxy
  devServer: {
    proxy: {
      '/api': 'http://127.0.0.1:8080/'
    }
  },
  plugins: [
    {
      plugin: CracoAlias,
      options: {
        source: 'options',
        baseUrl: './',
        aliases: {
          '@': './src/',
          crypto: './node_modules/crypto-browserify',
          stream: './node_modules/stream-browserify',
          assert: './node_modules/assert',
          http: './node_modules/stream-http',
          https: './node_modules/https-browserify',
          os: './node_modules/os-browserify'
        }
      }
    },
    {
      plugin: CracoLessPlugin,
      options: {}
    }
  ]
};
