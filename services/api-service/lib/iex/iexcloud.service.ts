import * as dotenv from 'dotenv';
import got from 'got';

const baseURL = 'https://cloud.iexapis.com/';
const sandboxURL = 'https://sandbox.iexapis.com/';

dotenv.config({ path: __dirname + '/../../../.env' });

const pk = process.env.IEXCLOUD_PUBLIC_KEY_TEST || process.env.IEXCLOUD_PUBLIC_KEY;
const apiversion = process.env.IEXCLOUD_API_VERSION;
const isSandboxMode = pk && pk[0] === 'T';

const prefix = () => {
  return isSandboxMode ? sandboxURL : baseURL;
};

export const tokenPlugin = got.extend({
  searchParams: { token: pk }
});

export const iexApiRequest = async <T>(endpoint: string, params = {}): Promise<T> => {
  const url = `${prefix()}${apiversion}${endpoint}`;
  const resp = await tokenPlugin.get(url, {
    searchParams: {
      ...params
    }
  });
  return JSON.parse(resp.body);
};

export default iexApiRequest;
