import * as dotenv from 'dotenv';
import got from 'got';

const baseURL = 'https://api.polygon.io/';

dotenv.config({ path: __dirname + '/../../../../.env' });

const pk = process.env.POLYGONIO_PUBLIC_KEY_TEST || process.env.POLYGONIO_PUBLIC_KEY;
const APIVersion = process.env.POLYGONIO_API_VERSION;

export const tokenPlugin = got.extend({
  searchParams: { apiKey: pk }
});

export const polygonIOApiRequest = async <T>(
  endpoint: string,
  params = {},
  apiversion = APIVersion
): Promise<T> => {
  const url = `${baseURL}${apiversion}${endpoint}`;
  const resp = await tokenPlugin.get(url, {
    searchParams: {
      ...params
    }
  });
  return JSON.parse(resp.body);
};
