import { Socials } from 'api-service';
const FrontPageService = Socials.Reddit.FrontPageService.Service;
const PostDiscussionService = Socials.Reddit.PostDiscussionService.Service;

export const frontPageGather = async (subreddit: string): Promise<Socials.Reddit.Types.Post[]> => {
  return await FrontPageService.getFrontPage(subreddit);
};

export const discussionGather = async (postId: string): Promise<Socials.Reddit.Types.Comment[]> => {
  return await PostDiscussionService.getPostDiscussion(postId);
};
