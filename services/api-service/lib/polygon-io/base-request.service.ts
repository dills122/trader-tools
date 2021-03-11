
import * as dotenv from "dotenv";
import got from 'got';

const baseURL = "https://api.polygon.io/";

dotenv.config({ path: __dirname + '/../../../.env' });

const pk = process.env.POLYGONIO_PUBLIC_KEY_TEST || process.env.POLYGONIO_PUBLIC_KEY;
const apiversion = process.env.POLYGONIO_API_VERSION;


export const tokenPlugin = got.extend({
    searchParams: { 'apiKey': pk }
});

export const polygonIOApiRequest = async <T>(
    endpoint: string,
    params = {}
): Promise<T> => {
    try {
        const url = `${baseURL}${apiversion}${endpoint}`;
        const resp = await tokenPlugin.get(url, {
            searchParams: {
                ...params
            }
        });
        return JSON.parse(resp.body);
    } catch (error) {
        throw error;
    }
};
