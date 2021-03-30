import _ from 'lodash';
import BadWords from 'bad-words';
import { Socials } from 'api-service';
import { SentimentAnalysisFilterFlags } from '../../shared-types';
import { EquityFilter } from './equity-filter';

export interface CommentFilterArgs extends SentimentAnalysisFilterFlags {
  comments: Socials.Reddit.Types.Comment[];
}

export class CommentFilter {
  private comments: Socials.Reddit.Types.Comment[];
  private matureFilter: boolean;

  constructor(args: CommentFilterArgs) {
    _.assign(this, args);
  }

  filter(): Socials.Reddit.Types.CommentExtended[] {
    // Stickied posts are normally informational to the thread and not worth reading
    this.removeStickiedAndEmptyComments();
    this.removeNewLinesIfPresent();

    const commentsWithTickerLikeSymbols = this.filterCommentsWithCompaniesMentioned(this.comments);

    if (this.matureFilter) {
      return this.removeMatureComments(commentsWithTickerLikeSymbols);
    }
    return commentsWithTickerLikeSymbols;
  }

  private filterCommentsWithCompaniesMentioned(filteredComments: Socials.Reddit.Types.Comment[]) {
    return filteredComments
      .map((comment) => {
        const commentData = comment.body;
        const filter = new EquityFilter({
          stringToAnalyze: commentData
        });
        filter.filter();
        return {
          ...comment,
          tickerSymbol: filter.getTickerSymbolIfPresent()
        };
      })
      .filter((comment) => comment.tickerSymbol && !_.isEmpty(comment.tickerSymbol));
  }

  private removeStickiedAndEmptyComments() {
    const nonStickiedComments = this.comments.filter((comment) => {
      return !comment.stickied;
    });

    const nonEmptyComments = nonStickiedComments.filter((comment) => {
      return comment.body && comment.body.length > 0;
    });
    this.comments = nonEmptyComments;
    return nonEmptyComments;
  }

  private removeMatureComments(filteredComments: Socials.Reddit.Types.CommentExtended[]) {
    const badWordFilter = new BadWords();

    const nonProfaneCheckedInput = filteredComments.filter((comment) => {
      const commentData = comment.body;
      return !badWordFilter.isProfane(commentData);
    });
    return nonProfaneCheckedInput;
  }

  private removeNewLinesIfPresent() {
    this.comments = this.comments.map((comment) => {
      if (!comment.body.includes('\n')) {
        return comment;
      }
      const cleanedString = comment.body.replace(/\r?\n|\r/g, '');
      return {
        ...comment,
        body: cleanedString
      };
    });
    return this.comments;
  }
}
