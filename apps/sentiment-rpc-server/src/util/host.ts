const isRunningInDocker = process.env.DOCKER;
const PORT = process.env.SENTIMENT_RPC_PORT || 9090;
const HOST = isRunningInDocker ? 'admin-api' : 'localhost';

export const buildHostStr = (): string => {
  return `${HOST}:${PORT}`;
};
