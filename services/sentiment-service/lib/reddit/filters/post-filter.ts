/* eslint-disable no-case-declarations */
import { Socials } from 'api-service';
import _ from 'lodash';
import { FlairFilter } from './flair-filter';
import { EquityFilter, FilterType } from './';
import { OverrideFlags } from './models/override-flags';

export interface PostFilterArgs {
  posts: Socials.Reddit.Types.Post[];
  filterType: FilterType;
  overrideTypes: OverrideFlags;
}

export class PostFilter {
  private posts: Socials.Reddit.Types.Post[];
  private filteredPosts: Socials.Reddit.Types.Post[] = [];
  private filterType: FilterType;
  private overrideTypes: OverrideFlags;

  constructor(args: PostFilterArgs) {
    _.assign(this, args);
  }

  filter(): Socials.Reddit.Types.Post[] {
    this.filterPostsByFlairType();
    if (this.overrideTypes.postMustContainSecurity) {
      this.filterPostsByTitlesContainingSecurityMentions();
    }
    return this.filteredPosts;
  }

  private filterPostsByTitlesContainingSecurityMentions() {
    this.filteredPosts = this.filteredPosts.filter((post) => {
      const equityFilter = new EquityFilter({
        stringToAnalyze: post.title
      });
      const securitySymbolIfPresent = equityFilter.filter();
      return securitySymbolIfPresent;
    });
  }

  private filterPostsByFlairType() {
    for (const post of this.posts) {
      try {
        switch (this.filterType) {
          case FilterType.chaos:
            this.filteredPosts.push(post);
            continue;
          case FilterType.discussion:
          case FilterType.general:
          case FilterType.expanded:
          case FilterType.shitpost:
            const filteredPost = this.filterPostByFlairType(post);
            filteredPost && this.filteredPosts.push(post);
            continue;
        }
      } catch (err) {
        console.error(err);
        throw err;
      }
    }
    return this.filteredPosts;
  }

  private filterPostByFlairType(post: Socials.Reddit.Types.Post): Socials.Reddit.Types.Post | undefined {
    const flairFilter = new FlairFilter({
      filterType: this.filterType,
      flair: post.flair || '',
      subreddit: post.subreddit
    });
    if (flairFilter.filter()) {
      return post;
    }
    return;
  }

  isSticked(post: Socials.Reddit.Types.Post): boolean {
    return post.stickied;
  }
}
