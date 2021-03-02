import { Socials } from 'api-service';
import { CommentFilter, PostFilter } from '../filters';
import { CommentAnalyzer } from '../analyzer';
import _ from 'lodash';
import { CommentListAnalyzerResult } from '../analyzer/comment-list-analyzer';

const Reddit = Socials.Reddit;
export interface FrontPageServiceArgs {
    subreddit: string
};

export class FrontPageService {
    private subreddit: string;
    private analyizedCommentsList: CommentListAnalyzerResult[] = [];
    constructor(args: FrontPageServiceArgs) {
        _.assign(this, args);
        if (!Reddit.Service.subredditsConfig.includes(this.subreddit)) {
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
            const filteredPosts = this.filterPosts(linkPostList);

            for (let post of filteredPosts) {
                const commentUrl = Reddit.Util.trimAndFixUrl(post.data.url);

                const commentThread = await Reddit.Service.getPostAndCommentThread(commentUrl);
                //Continue to next post if no comments present
                if (commentThread.discussion.length <= 0) {
                    continue;
                }

                const filteredComments = this.filterComments(commentThread);

                //If a post has no comments after filtering, continue to next post
                if (filteredComments.length <= 0) {
                    continue;
                }

                this.analyizeCommentCollection(filteredComments, post.data.title);
            }
            // TODO group postive and negative comments by ticker and get total for each mention
        } catch (err) {
            throw err;
        }
    }

    private filterPosts(postList: Socials.Reddit.Types.RedditLinkSchema[]) {
        const postFilterInst = new PostFilter.PostFilter({
            posts: postList,
            discussionOnlyMode: true,
            nonShitpostingMode: true
        });
        const filteredPosts = postFilterInst.filter();
        if (filteredPosts.length <= 0) {
            throw Error('No suitable posts found to process');
        }
        return filteredPosts;
    }

    private filterComments(comments) {
        const filteredCommentsInst = new CommentFilter.CommentFilter({
            comments: comments,
            nonShitpostingMode: true
        });

        return filteredCommentsInst.filter();
    }

    private analyizeCommentCollection(comments, title: string) {
        const CommentAnalyzerInst = new CommentAnalyzer.CommentListAnalyzer({
            comments: comments,
            subreddit: this.subreddit,
            title: title
        });

        const commentAnalysisResults = CommentAnalyzerInst.analyze();
        if (commentAnalysisResults.positiveComments.length > 0 || commentAnalysisResults.negativeComments.length > 0) {
            this.analyizedCommentsList.push(commentAnalysisResults);
        }
    }
}