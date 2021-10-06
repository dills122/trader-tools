import Server from './src/server';

(async () => {
  await Server.initialize();
  await Server.register();
  await Server.start();
})();
