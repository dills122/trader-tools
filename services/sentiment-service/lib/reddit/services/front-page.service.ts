import { Socials } from 'api-service';
import { CommentFilter, PostFilter } from '../filters';
import { CommentAnalyzer } from '../analyzer';
import _ from 'lodash';

const Reddit = Socials.Reddit;
export interface FrontPageServiceArgs {
    subreddit: string
};

export class FrontPageService {
    private subreddit: string;
    constructor(args: FrontPageServiceArgs) {
        _.assign(this, args);
        if (!Reddit.Service.subreddits.includes(this.subreddit)) {
            throw Error('Unsupported subreddit');
        }
    }

    async service() {
        try {
            const frontPage = await Reddit.Service.getFrontPageOfSubreddit(this.subreddit);
            const linkPostList = frontPage.data.children;
            if (!Socials.Reddit.Types.isRedditLinkSchemaList(linkPostList)) {
                throw Error('Incompatible data type returned');
            }
            const postFilterInst = new PostFilter.PostFilter({
                posts: linkPostList,
                discussionOnlyMode: true,
                nonShitpostingMode: true
            });
            const filteredPosts = postFilterInst.filter();
            if (filteredPosts.length <= 0) {
                throw Error('No suitable posts found to process');
            }
            for (let post of filteredPosts) {
                const commentUrl = Reddit.Util.trimAndFixUrl(post.data.url);

                const commentThread = await Reddit.Service.getPostAndCommentThread(commentUrl);
                //Continue to next post if no comments present
                if (commentThread.discussion.length <= 0) {
                    continue;
                }
                const filteredCommentsInst = new CommentFilter.CommentFilter({
                    comments: commentThread.discussion,
                    nonShitpostingMode: true
                });

                const filteredComments = filteredCommentsInst.filter();
                //If a post has no comments after filtering, continue to next post
                if (filteredComments.length <= 0) {
                    continue;
                }

            }

        } catch (err) {
            throw err;
        }
    }
}