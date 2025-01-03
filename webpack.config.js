const webpackNodeExternals = require('webpack-node-externals');

module.exports = (options, webpack) => {
  const lazyImports = [
    '@nestjs/microservices/microservices-module',
    '@nestjs/websockets/socket-module',
  ];

  return {
    ...options,
    resolve: {
      alias: {
        'class-transformer/storage': 'class-transformer/cjs/storage',
      },
      extensions: ['.ts', '.js'],
    },
    externals: [
      webpackNodeExternals({
        allowlist: ['@nestjs/swagger', 'swagger-ui-express'], // Swagger 관련 모듈 포함
      }),
    ],
    plugins: [
      ...options.plugins,
      new webpack.IgnorePlugin({
        checkResource(resource) {
          if (lazyImports.includes(resource)) {
            try {
              require.resolve(resource);
            } catch (err) {
              return true;
            }
          }
          return false;
        },
      }),
    ],
  };
};
