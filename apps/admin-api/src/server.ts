import Hapi from '@hapi/hapi';
import { routes } from '.';

const isRunningInDocker = process.env.DOCKER;
const PORT = process.env.ADMIN_API_PORT || 5050;
const HOST = isRunningInDocker ? 'admin-api' : 'localhost';

const server: Hapi.Server = Hapi.server({
  port: PORT,
  host: HOST
});

const initialize = async () => {
  await server.initialize();
  return server;
};

const register = async () => {
  await server.register(routes);
};

const start = async () => {
  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
  return server;
};

process.on('unhandledRejection', (err) => {
  console.error(err);
  process.exit(1);
});

export default {
  initialize,
  start,
  register
};
