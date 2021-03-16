import { Socials } from 'api-service';
const FrontPageService = Socials.Reddit.FrontPageService.Service;

export const gather = async (subreddit: string) => {
    try {
        const resp = await FrontPageService.getFrontPage(subreddit);
        // const resp = await Socials.Reddit.Service.getFrontPageOfSubreddit(subreddit);
        // if (!Socials.Reddit.Types.isRedditLinkSchemaList(resp.data.children)) {
        //     throw Error('Unsupported data was returned, unable to continue');
        // }
        return resp;
    } catch (err) {
        throw err;
    }
};
