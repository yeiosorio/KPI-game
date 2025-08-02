console.log('PROXY_CONFIG', process.env.TZ);
const PROXY_CONFIG = {
  '/api/**': {
    target: 'https://api.superlikerslabs.com/v1',
    secure: true,
    changeOrigin: true,
    logLevel: 'debug',
    rewrite: function (path) {
      return path.replace(/^\/api/, '');
    }
  }
};

module.exports = PROXY_CONFIG;