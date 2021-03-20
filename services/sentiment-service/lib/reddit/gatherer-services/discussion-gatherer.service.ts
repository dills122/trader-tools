import { Socials } from 'api-service';
const PostDiscussionService = Socials.Reddit.PostDiscussionService.Service;

export const discussionGather = async (postId: string) => {
    try {
        const resp = await PostDiscussionService.getPostDiscussion(postId);
        return resp;
    } catch (err) {
        throw err;
    }
};
