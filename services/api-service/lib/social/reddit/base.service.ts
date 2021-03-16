import snoowrap from 'snoowrap';
import * as dotenv from "dotenv";


dotenv.config({ path: __dirname + '/../../../.env' });

const UserAgent = process.env.REDDIT_USER_AGENT;
const ClientId = process.env.REDDIT_CLIENTID;
const ClientSecret = process.env.CLIENT_SECRET;
const RefreshToken = process.env.REFRESH_TOKEN;


export const connect = () => {
    if (![UserAgent, ClientId, ClientSecret, RefreshToken].every(i => i !== undefined)) {
        throw Error('Unable to connect, credentials were not loaded correctly');
    }
    const connection = new snoowrap({
        userAgent: UserAgent || '', // Typescript complaining
        clientId: ClientId,
        clientSecret: ClientSecret,
        refreshToken: RefreshToken
    });
    return connection;
};
