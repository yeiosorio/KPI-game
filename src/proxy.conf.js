module.exports = {
  "/api/**": {
    "target": "https://api.superlikerslabs.com/v1",
    "secure": true,
    "changeOrigin": true,
    "logLevel": "debug",
    "rewrite": function (path) {
      return path.replace(/^\/api/, '');
    }
  }
};