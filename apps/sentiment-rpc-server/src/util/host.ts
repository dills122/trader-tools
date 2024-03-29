import * as dotenv from 'dotenv';

dotenv.config({ path: __dirname + '/../../.env' });

const PORT = process.env.SENTIMENT_RPC_PORT || 9090;
const HOST = 'localhost';

export const buildHostStr = (): string => {
  return `${HOST}:${PORT}`;
};
