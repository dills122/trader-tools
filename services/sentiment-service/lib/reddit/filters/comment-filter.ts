import _ from 'lodash';
import BadWords from 'bad-words';
import { Socials } from 'api-service';
import { EquityFilter } from './equity-filter';
import { EntityFilter } from './entity-filter';
import { config, SubredditConfigSchema } from '../config';
import { FilterType } from './';

export interface CommentFilterArgs {
  comments: Socials.Reddit.Types.Comment[];
  subreddit: string;
  equityWhitelistEnabled?: boolean;
  equityWhitelist?: string[];
  filterType: FilterType; //TODO does not seemed to be used here
}

export class CommentFilter {
  private comments: Socials.Reddit.Types.Comment[];
  private matureFilter: boolean;
  private whitelist: string[];
  private subreddit: string;
  private subredditConfig: SubredditConfigSchema;
  private filterType: FilterType;

  constructor(args: CommentFilterArgs) {
    _.assign(this, args);
    this.subreddit = args.subreddit;
    this.subredditConfig = config.subreddits[this.subreddit];
    this.matureFilter = this.shouldEnableMatureLanguageFilter();
    if (args.equityWhitelistEnabled || (args.equityWhitelist && args.equityWhitelist.length > 0)) {
      this.whitelist = args.equityWhitelist || this.subredditConfig.whitelist;
    }
  }

  filter(): Socials.Reddit.Types.CommentExtended[] {
    this.removeNonEmptyComments();
    // Stickied posts are normally informational to the thread and not worth reading
    this.removeStickiedComments();
    this.executeEntityFilter();

    const commentsWithTickerLikeSymbols = this.filterCommentsWithCompaniesMentioned(this.comments);

    if (this.matureFilter) {
      return this.removeMatureComments(commentsWithTickerLikeSymbols);
    }
    return commentsWithTickerLikeSymbols;
  }

  private filterCommentsWithCompaniesMentioned(filteredComments: Socials.Reddit.Types.Comment[]) {
    const commentsWithTickers = filteredComments
      .map((comment) => {
        const commentData = comment.body;
        const filter = new EquityFilter({
          stringToAnalyze: commentData,
          equityWhitelist: this.whitelist
        });
        filter.filter();
        return {
          ...comment,
          tickerSymbol: filter.getTickerSymbolIfPresent()
        };
      })
      .filter((comment) => comment.tickerSymbol && !_.isEmpty(comment.tickerSymbol));
    if (this.whitelist && this.whitelist.length > 0) {
      return commentsWithTickers.filter((comment) => this.whitelist.includes(comment.tickerSymbol));
    }
    return commentsWithTickers;
  }

  private shouldEnableMatureLanguageFilter() {
    return ![FilterType.shitpost, FilterType.chaos].includes(this.filterType);
  }

  private removeStickiedComments() {
    this.comments = this.comments.filter((comment) => {
      return !comment.stickied;
    });
  }

  private removeNonEmptyComments() {
    this.comments = this.comments.filter((comment) => {
      return comment.body && comment.body.length > 0;
    });
  }

  private removeMatureComments(filteredComments: Socials.Reddit.Types.CommentExtended[]) {
    //TODO Make this into its own filter service, could be the start of a generic filter type
    const badWordFilter = new BadWords();

    const nonProfaneCheckedInput = filteredComments.filter((comment) => {
      const commentData = comment.body;
      return !badWordFilter.isProfane(commentData);
    });
    return nonProfaneCheckedInput;
  }

  private executeEntityFilter() {
    const entityFilter = new EntityFilter();
    this.comments = this.comments.map((comment) => {
      entityFilter.filter(comment.body);
      return {
        ...comment,
        body: entityFilter.getCleanString()
      };
    });
    return this.comments;
  }
}
