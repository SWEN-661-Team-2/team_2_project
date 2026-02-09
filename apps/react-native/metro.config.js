const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.watchFolders = [];
config.server = {
  ...config.server,
  enhanceMiddleware: (middleware) => {
    return (req, res, next) => {
      // Disable file watching
      res.setHeader('X-Metro-HMR-Server-Capabilities', '');
      return middleware(req, res, next);
    };
  },
};

module.exports = config;
