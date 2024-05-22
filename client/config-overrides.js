const webpack = require('webpack');

module.exports = function override(config) {
  config.resolve.fallback = {
    http: require.resolve('stream-http'),
    https: require.resolve('https-browserify'),
    zlib: require.resolve('browserify-zlib'),
    stream: require.resolve('stream-browserify'),
    util: require.resolve('util'),
    assert: require.resolve('assert'),
    url: require.resolve('url'),
    buffer: require.resolve('buffer'),
    process: require.resolve('process/browser')
  };

  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    }),
  ]);

  return config;
};
