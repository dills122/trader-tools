import { Socials } from "api-service";
import { analyze, SentimentAnalysisResult, SentimentConfig } from '../../analyze-sentiment';
import { standardizeInput } from '../../standardize-input';

export interface CommentListAnalyzerArgs {
    comments: Socials.Reddit.Types.RedditCommentSchemaExtended[],
    title: string,
    subreddit: string
};

export interface CommentListAnalyzerResult {
    title: string,
    subreddit: string,
    positiveComments: SentimentAnalysisResultExtended[],
    negativeComments: SentimentAnalysisResultExtended[],
    neutralComments: SentimentAnalysisResultExtended[]
};

export interface SentimentAnalysisResultExtended extends SentimentAnalysisResult {
    comment: string[],
    tickerSymbol: string
};

export class CommentListSentimentAnalyzer {
    private comments: Socials.Reddit.Types.RedditCommentSchemaExtended[];
    private title: string;
    private subreddit: string;
    private positiveComments: SentimentAnalysisResultExtended[] = [];
    private negativeComments: SentimentAnalysisResultExtended[] = [];
    private neutralComments: SentimentAnalysisResultExtended[] = [];

    constructor(args: CommentListAnalyzerArgs) {
        this.comments = args.comments;
        this.title = args.title;
        this.subreddit = args.subreddit;
    }

    analyze(): CommentListAnalyzerResult {
        const standardizedComments = this.standardizeData();

        const analyizedComments = standardizedComments.map((standizedCommentData) => {
            return {
                ...standizedCommentData,
                ...analyze(standizedCommentData.comment)
            };
        });

        const positiveComments = analyizedComments.filter((comment) => {
            return comment.score >= SentimentConfig.positive;
        });

        this.positiveComments = this.positiveComments.concat(positiveComments);

        const negativeComments = analyizedComments.filter((comment) => {
            return comment.score <= SentimentConfig.negative;
        });

        this.negativeComments = this.negativeComments.concat(negativeComments);

        const neutralComments = analyizedComments.filter((comment) => {
            return comment.score > SentimentConfig.negative && comment.score < SentimentConfig.positive;
        });

        this.neutralComments = this.neutralComments.concat(neutralComments);

        return {
            title: this.title,
            subreddit: this.subreddit,
            positiveComments: this.positiveComments,
            negativeComments: this.negativeComments,
            neutralComments: this.neutralComments
        };
    }

    private standardizeData() {
        const commentWithTickerSymbol = this.comments.map((comment) => {
            return {
                comment: comment.data.body,
                tickerSymbol: comment.tickerSymbol
            };
        });

        return commentWithTickerSymbol.map((body) => {
            return {
                ...body,
                comment: standardizeInput(body.comment)
            };
        });
    }
};
