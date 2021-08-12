const host = 'localhost:9090';
const ip = process.env.IP;
const port = process.env.PORT;

export const buildHostStr = (): string => {
  return host && ip ? `${ip}:${port}` : host;
};
