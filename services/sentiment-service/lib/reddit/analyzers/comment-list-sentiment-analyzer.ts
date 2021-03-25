import { Socials } from "api-service";
import _ from "lodash";
import { analyze, SentimentAnalysisResult } from '../../analyze-sentiment';
import { SentimentConfig } from "../../sentiment.config";
import { standardizeInput } from '../../standardize-input';
import { config, SubredditConfigSchema } from '../config';

export interface CommentListAnalyzerArgs {
    comments: Socials.Reddit.Types.CommentExtended[],
    title: string,
    subreddit: string
}

export interface CommentListAnalyzerResult {
    title: string,
    subreddit: string,
    positiveComments: SentimentAnalysisResultExtended[],
    negativeComments: SentimentAnalysisResultExtended[],
    neutralComments: SentimentAnalysisResultExtended[]
}

export interface SentimentAnalysisResultExtended extends SentimentAnalysisResult {
    comment: string[],
    tickerSymbol: string
}

export class CommentListSentimentAnalyzer {
    private comments: Socials.Reddit.Types.CommentExtended[];
    private title: string;
    private subreddit: string;
    private subredditConfig: SubredditConfigSchema;
    private positiveComments: SentimentAnalysisResultExtended[] = [];
    private negativeComments: SentimentAnalysisResultExtended[] = [];
    private neutralComments: SentimentAnalysisResultExtended[] = [];

    constructor(args: CommentListAnalyzerArgs) {
        this.comments = args.comments;
        this.title = args.title;
        this.subreddit = args.subreddit;
        this.subredditConfig = config.subreddits[this.subreddit];
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
                comment: comment.body,
                tickerSymbol: comment.tickerSymbol
            };
        });

        return commentWithTickerSymbol.map((body) => {
            try {
                return {
                    ...body,
                    comment: standardizeInput(body.comment, this.subredditConfig.whitelist)
                };
            } catch (err) {
                return {
                    ...body,
                    comment: []
                };
            }
        }).filter(obj => !_.isEmpty(obj.comment));
    }
}
