const { withNativeFederation, shareAll } = require('@angular-architects/native-federation/config');

module.exports = withNativeFederation({
  name: 'shell',
  shared: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
  },
  exposes: {
    './SharedStateService': './projects/shell/src/app/service/shared-state-service.ts',
  },
   remotes: {
    // The names here MUST match the 'name' in the remote's federation.config.js
    "header": "http://localhost:4201/remoteEntry.json",
    "users": "http://localhost:4202/remoteEntry.json",
    "chat": "http://localhost:4203/remoteEntry.json",
    "auth": "http://localhost:4204/remoteEntry.json",
  },

  skip: [
    'rxjs/ajax',
    'rxjs/fetch',
    'rxjs/testing',
    'rxjs/webSocket',
    // Add further packages you don't need at runtime
  ],

  // Please read our FAQ about sharing libs:
  // https://shorturl.at/jmzH0

  features: {
    // New feature for more performance and avoiding
    // issues with node libs. Comment this out to
    // get the traditional behavior:
    ignoreUnusedDeps: true
  }

});
