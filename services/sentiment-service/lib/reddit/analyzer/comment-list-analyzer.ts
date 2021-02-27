import { Socials } from "api-service";
import { analyze } from '../../analyze-sentiment';
import { standardizeInput } from '../../standardize-input';

export interface CommentListAnalyzerArgs {
    comments: Socials.Reddit.Types.RedditCommentSchema[],
    title: string,
    subreddit: string
};

export class CommentListAnalyzer {
    private comments: Socials.Reddit.Types.RedditCommentSchema[];
    private title: string;
    private subreddit: string;
    constructor(args: CommentListAnalyzerArgs) {
        this.comments = args.comments;
        this.title = args.title;
        this.subreddit = args.subreddit;
    }

    analyze() {
        const commentBodyList = this.comments.map((comment) => {
            return comment.data.body;
        });

        const standardizedComments = commentBodyList.map((body) => {
            return standardizeInput(body);
        });

        const analyizedComments = standardizedComments.map((standizedCommentData) => {
            return analyze(standizedCommentData);
        });

        //TODO create way to comb through the analyized comments and group together
    }


};
