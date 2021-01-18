
import * as dotenv from "dotenv";
import got from 'got';

const baseURL = "https://cloud.iexapis.com/";
const sandboxURL = "https://sandbox.iexapis.com/";

dotenv.config({ path: __dirname + '/../.env' });

const pk = process.env.IEXCLOUD_PUBLIC_KEY;
const apiversion = process.env.IEXCLOUD_API_VERSION;

const prefix = () => {
    return pk && pk[0] === "T" ? sandboxURL : baseURL;
};

const tokenPlugin = got.extend({
    searchParams: { 'token': pk }
})


export const iexApiRequest = async (
    endpoint: string,
    params = {}
): Promise<any> => {
    try {
        const resp = await tokenPlugin.get(`${prefix()}${apiversion}${endpoint}`, {
            searchParams: {
                ...params
            }
        });

        return resp;
    } catch (error) {
        // tslint:disable-next-line: no-console
        console.error(error);
    }
};

export default iexApiRequest;
