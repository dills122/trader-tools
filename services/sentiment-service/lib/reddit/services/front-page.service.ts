import _ from 'lodash';
import { Socials } from 'api-service';
import { CommentFilter, PostFilter } from '../filters';
import { CommentAnalyzer } from '../analyzers';
import { SentimentAnalysisFilterFlags } from '../../sharedTypes';
import { FrontPageGather } from '../gatherer-services';

const Reddit = Socials.Reddit;
export interface FrontPageServiceArgs {
    subreddit: string,
    analyzer: string,
    filterFlags: SentimentAnalysisFilterFlags
};

export class FrontPageService {
    private subreddit: string;
    private analyzer: string;
    private filterFlags: SentimentAnalysisFilterFlags;
    private analyizedCommentsList: CommentAnalyzer.CommentListAnalyzerResult[] = [];

    constructor(args: FrontPageServiceArgs) {
        _.assign(this, args);
        if (!Reddit.Service.subredditsConfig.includes(this.subreddit)) {
            throw Error('Unsupported subreddit');
        }
        console.log(this.analyzer);
    }

    async service() {
        try {
            const frontPagePosts = await FrontPageGather.gather(this.subreddit);

            const filteredPosts = this.filterPosts(frontPagePosts);

            console.log('Filtered Posts:', filteredPosts.map(post => post.title));

            for (let post of filteredPosts) {

                const commentThread = post.comments;

                //Continue to next post if no comments present
                if (commentThread.length <= 0) {
                    continue;
                }

                const filteredComments = this.filterComments(commentThread);

                console.log('Filtered Comments:', filteredComments.map(comment => comment.body));

                //If a post has no comments after filtering, continue to next post
                if (filteredComments.length <= 0) {
                    continue;
                }

                this.analyizeCommentCollection(filteredComments, post.title);
            }
        } catch (err) {
            throw err;
        }
    }

    getSentimentAnalysisResults() {
        return this.analyizedCommentsList;
    }

    private filterPosts(postList: Socials.Reddit.Snoowrap.Types.Post[]) {
        const postFilterInst = new PostFilter.PostFilter({
            posts: postList,
            discussionMode: this.filterFlags.discussionMode,
            chaosMode: this.filterFlags.chaosMode,
            ddMode: this.filterFlags.ddMode
        });
        const filteredPosts = postFilterInst.filter();
        if (filteredPosts.length <= 0) {
            throw Error('No suitable posts found to process');
        }
        return filteredPosts;
    }

    private filterComments(comments: Socials.Reddit.Snoowrap.Types.Comment[]) {
        const filteredCommentsInst = new CommentFilter.CommentFilter({
            comments: comments,
            ...this.filterFlags
        });

        return filteredCommentsInst.filter();
    }

    private analyizeCommentCollection(comments, title: string) {
        const CommentAnalyzerInst = new CommentAnalyzer.CommentListSentimentAnalyzer({
            comments: comments,
            subreddit: this.subreddit,
            title: title
        });

        const commentAnalysisResults = CommentAnalyzerInst.analyze();
        if (commentAnalysisResults.positiveComments.length > 0 ||
            commentAnalysisResults.negativeComments.length > 0 ||
            commentAnalysisResults.neutralComments.length > 0) {
            this.analyizedCommentsList.push(commentAnalysisResults);
        }
    }
};
