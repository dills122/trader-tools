import Server from './src/server';
import dotenv from 'dotenv';

(async () => {
  dotenv.config();
  await Server.initialize();
  await Server.register();
  await Server.start();
})();
