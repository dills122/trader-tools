import { Socials } from 'api-service';

export const gather = async (subreddit: string) => {
    try {
        const resp = await Socials.Reddit.Service.getFrontPageOfSubreddit(subreddit);
        if (!Socials.Reddit.Types.isRedditLinkSchemaList(resp.data.children)) {
            throw Error('Unsupported data was returned, unable to continue');
        }
        return resp.data.children;
    } catch (err) {
        throw err;
    }
};