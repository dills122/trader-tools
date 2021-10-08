/* eslint-disable no-case-declarations */
import { Socials } from 'api-service';
import _ from 'lodash';
import { FlairFilter } from './flair-filter';
import { FilterType } from './';

export interface PostFilterArgs {
  posts: Socials.Reddit.Types.Post[];
  filterType: FilterType;
}

export class PostFilter {
  private posts: Socials.Reddit.Types.Post[];
  private filteredPosts: Socials.Reddit.Types.Post[] = [];
  private filterType: FilterType;

  constructor(args: PostFilterArgs) {
    _.assign(this, args);
  }

  filter(): Socials.Reddit.Types.Post[] {
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
