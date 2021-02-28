import { Socials } from "api-service";
import { analyze, SentimentAnalysisResult, SentimentConfig } from '../../analyze-sentiment';
import { extractStockOrCryptoTicker, standardizeInput } from '../../standardize-input';

export interface CommentListAnalyzerArgs {
    comments: Socials.Reddit.Types.RedditCommentSchema[],
    title: string,
    subreddit: string
};

export interface CommentListAnalyzerResult {
    title: string,
    subreddit: string,
    positiveComments: SentimentAnalysisResult[],
    negativeComments: SentimentAnalysisResult[]
};

export class CommentListAnalyzer {
    private comments: Socials.Reddit.Types.RedditCommentSchema[];
    private title: string;
    private subreddit: string;
    private positiveComments: SentimentAnalysisResult[] = [];
    private negativeComments: SentimentAnalysisResult[] = [];
    constructor(args: CommentListAnalyzerArgs) {
        this.comments = args.comments;
        this.title = args.title;
        this.subreddit = args.subreddit;
    }

    analyze(): CommentListAnalyzerResult {
        const commentBodyList = this.comments.map((comment) => {
            return comment.data.body;
        });

        const commentsWithTickerLikeSymbols = commentBodyList.map((comment) => {
            const possibleTickerSymbols = extractStockOrCryptoTicker(comment);
            const tickerSymbol = possibleTickerSymbols[0];
            return {
                comment,
                tickerSymbol
            }
        });

        const standardizedComments = commentsWithTickerLikeSymbols.map((body) => {
            return {
                ...body,
                comment: standardizeInput(body.comment)
            };
        });

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

        return {
            title: this.title,
            subreddit: this.subreddit,
            positiveComments: this.positiveComments,
            negativeComments: this.negativeComments
        };
    }
};
