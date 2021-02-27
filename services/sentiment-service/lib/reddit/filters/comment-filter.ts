import { Socials } from "api-service";
import { extractStockOrCryptoTicker } from '../../standardize-input';
import _ from 'lodash';
import BadWords from 'bad-words';

export interface CommentFilterArgs {
    comments: Socials.Reddit.Types.RedditCommentSchema[],
    nonShitpostingMode: boolean
};

export class CommentFilter {
    private comments: Socials.Reddit.Types.RedditCommentSchema[];
    private nonShitpostingMode: boolean;
    constructor(args: CommentFilterArgs) {
        _.assign(this, args);
    }

    filter() {
        // Stickied posts are normally informational to the thread and not worth reading
        const nonStickiedComments = this.comments.filter((comment) => {
            return !comment.data.stickied;
        });

        const nonEmptyComments = nonStickiedComments.filter((comment) => {
            return comment.data.body && comment.data.body.length > 0;
        });

        const commentsWithTickerLikeSymbols = nonEmptyComments.filter((comment) => {
            const commentData = comment.data.body;
            const possibleTickerSymbols = extractStockOrCryptoTicker(commentData);
            return possibleTickerSymbols.length > 0;
        });

        if (this.nonShitpostingMode) {
            return this.nonShitpostingModeFilter(commentsWithTickerLikeSymbols);
        }
        return commentsWithTickerLikeSymbols;
    }

    private nonShitpostingModeFilter(filteredComments: Socials.Reddit.Types.RedditCommentSchema[]) {
        const badWordFilter = new BadWords();

        const nonProfaneCheckedInput = filteredComments.filter((comment) => {
            const commentData = comment.data.body;
            return !badWordFilter.isProfane(commentData);
        });
        return nonProfaneCheckedInput;
    }
}