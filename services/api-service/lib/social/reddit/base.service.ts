import snoowrap from 'snoowrap';
import * as dotenv from "dotenv";


dotenv.config({ path: __dirname + '/../../../.env' });

const UserAgent = process.env.REDDIT_USER_AGENT;
const ClientId = process.env.REDDIT_CLIENT_ID;
const ClientSecret = process.env.REDDIT_CLIENT_SECRET;
const Username = process.env.REDDIT_USERNAME;
const Password = process.env.REDDIT_PASSWORD;


export const connect = () => {
    if (![UserAgent, ClientId, ClientSecret, Username, Password].every(i => i !== undefined)) {
        throw Error('Unable to connect, credentials were not loaded correctly');
    }
    const connection = new snoowrap({
        userAgent: UserAgent || '', // Typescript complaining
        clientId: ClientId,
        clientSecret: ClientSecret,
        username: Username,
        password: Password
    });
    return connection;
};
