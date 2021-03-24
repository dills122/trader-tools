import { Socials } from 'api-service';
const FrontPageService = Socials.Reddit.FrontPageService.Service;
const PostDiscussionService = Socials.Reddit.PostDiscussionService.Service;

export const frontPageGather = async (subreddit: string) => {
    try {
        const resp = await FrontPageService.getFrontPage(subreddit);
        return resp;
    } catch (err) {
        throw err;
    }
};

export const discussionGather = async (postId: string) => {
    try {
        const resp = await PostDiscussionService.getPostDiscussion(postId);
        return resp;
    } catch (err) {
        throw err;
    }
};
