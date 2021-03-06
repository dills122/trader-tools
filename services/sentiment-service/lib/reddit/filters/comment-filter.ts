import { Socials } from "api-service";
import { extractStockOrCryptoTicker } from '../../standardize-input';
import _ from 'lodash';
import BadWords from 'bad-words';
import { SentimentAnalysisFilterFlags } from "../../sharedTypes";

export interface CommentFilterArgs extends SentimentAnalysisFilterFlags {
    comments: Socials.Reddit.Types.RedditCommentSchema[]
};

export class CommentFilter {
    private comments: Socials.Reddit.Types.RedditCommentSchema[];
    private matureFilter: boolean;
    // private emojiFilter: boolean;
    // private hashtagFilter: boolean;

    constructor(args: CommentFilterArgs) {
        _.assign(this, args);
    }

    filter(): Socials.Reddit.Types.RedditCommentSchemaExtended[] {
        // Stickied posts are normally informational to the thread and not worth reading
        const nonEmptyComments = this.removeStickiedAndEmptyComments();

        const commentsWithTickerLikeSymbols: Socials.Reddit.Types.RedditCommentSchemaExtended[] = nonEmptyComments.map((comment) => {
            const commentData = comment.data.body;
            const possibleTickerSymbols = extractStockOrCryptoTicker(commentData);
            return {
                ...comment,
                tickerSymbol: possibleTickerSymbols[0]
            };
        }).filter((comment) => !!comment.tickerSymbol);

        if (this.matureFilter) {
            return this.removeMatureComments(commentsWithTickerLikeSymbols);
        }
        return commentsWithTickerLikeSymbols;
    }

    private removeStickiedAndEmptyComments() {
        const nonStickiedComments = this.comments.filter((comment) => {
            return !comment.data.stickied;
        });

        const nonEmptyComments = nonStickiedComments.filter((comment) => {
            return comment.data.body && comment.data.body.length > 0;
        });

        return nonEmptyComments;
    }

    private removeMatureComments(filteredComments: Socials.Reddit.Types.RedditCommentSchemaExtended[]) {
        const badWordFilter = new BadWords();

        const nonProfaneCheckedInput = filteredComments.filter((comment) => {
            const commentData = comment.data.body;
            return !badWordFilter.isProfane(commentData);
        });
        return nonProfaneCheckedInput;
    }
}