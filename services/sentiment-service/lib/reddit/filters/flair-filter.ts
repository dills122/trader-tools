import _ from 'lodash';
import { FilterType } from './';

export const flairConfig = {
  subreddits: {
    wallstreetbets: {
      good: ['chart', 'news', 'discussion', 'dd', 'weekend discussion', 'technical analysis'],
      bad: ['meme', 'shitpost'],
      netural: ['loss', 'gain', 'yolo'],
      discussion: ['discussion', 'weekend discussion']
    }
  }
};

export interface FlairConfigSubredditItem {
  good: string[];
  bad: string[];
  netural: string[];
  discussion: string[];
}

export interface FlairFilterArgs {
  flair: string;
  subreddit: string;
  filterType: FilterType;
}

export class FlairFilter {
  private flair: string;
  private subreddit: string;
  private filterType: FilterType;
  private subredditConfig: FlairConfigSubredditItem;
  constructor(args: FlairFilterArgs) {
    _.assign(this, args);
    this.flair = this.flair.toLowerCase();
    this.checkSubreddit();
    this.subredditConfig = flairConfig.subreddits[this.subreddit];
  }

  filter(): boolean {
    this.checkSubreddit();
    switch (this.filterType) {
      case FilterType.shitpost:
        return this.shitpostMode();
      case FilterType.discussion:
        return this.discussionMode();
      case FilterType.chaos:
        return this.chaosMode();
      case FilterType.general:
        return this.generalMode();
      case FilterType.expanded:
        return this.expandedMode();
      default:
        throw Error('Unsupported filter type');
    }
  }

  private expandedMode() {
    const { good, netural, discussion } = this.subredditConfig;
    return [...good, ...discussion, ...netural].includes(this.flair);
  }

  private generalMode() {
    const { good, discussion } = this.subredditConfig;
    return [...good, ...discussion].includes(this.flair);
  }

  private shitpostMode() {
    const { bad } = this.subredditConfig;
    return bad.includes(this.flair);
  }

  private discussionMode() {
    return this.subredditConfig.discussion.includes(this.flair);
  }

  private chaosMode() {
    const { netural, bad, discussion, good } = this.subredditConfig;
    return [...netural, ...bad, ...discussion, ...good].includes(this.flair);
  }

  private checkSubreddit() {
    const supportedSubreddits = _.keys(flairConfig.subreddits);
    if (!supportedSubreddits.includes(this.subreddit)) {
      throw Error('Unsupported subreddit');
    }
  }
}
