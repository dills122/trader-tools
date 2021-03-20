import { Socials } from 'api-service';
const FrontPageService = Socials.Reddit.FrontPageService.Service;

export const frontPageGather = async (subreddit: string) => {
    try {
        const resp = await FrontPageService.getFrontPage(subreddit);
        return resp;
    } catch (err) {
        throw err;
    }
};
