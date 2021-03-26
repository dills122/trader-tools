import { Socials } from 'api-service';
const FrontPageService = Socials.Reddit.FrontPageService.Service;
const PostDiscussionService = Socials.Reddit.PostDiscussionService.Service;

export const frontPageGather = async (subreddit: string): Promise<Socials.Reddit.Types.Post[]> => {
    const resp = await FrontPageService.getFrontPage(subreddit);
    return resp;
};

export const discussionGather = async (postId: string): Promise<Socials.Reddit.Types.Comment[]> => {
    const resp = await PostDiscussionService.getPostDiscussion(postId);
    return resp;
};
