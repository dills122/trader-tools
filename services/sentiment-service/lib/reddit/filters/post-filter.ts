import { Socials } from 'api-service';
import _ from 'lodash';
import { SentimentAnalysisFilterFlags } from '../../sharedTypes';
import { FlairFilter } from './flair-filter';

export interface PostFilterArgs extends SentimentAnalysisFilterFlags {
    posts: Socials.Reddit.Snoowrap.Types.Post[]
};

export class PostFilter {
    private discussionMode: boolean;
    private chaosMode: boolean;
    private ddMode: boolean;
    private posts: Socials.Reddit.Snoowrap.Types.Post[];
    private filteredPosts: Socials.Reddit.Snoowrap.Types.Post[] = [];

    constructor(args: PostFilterArgs) {
        _.assign(this, args);
    }

    filter() {
        for (let post of this.posts) {
            //TODO reimplement this feature
            // if (this.stickedMode && this.isSticked(post)) {
            //     this.filteredPosts.push(post);
            //     continue;
            // }

            if (this.chaosMode) {
                this.filteredPosts.push(post);
                continue;
            }

            if (this.discussionMode) {
                const flairFilter = new FlairFilter({
                    filterType: 'discussion',
                    flair: post.flair || '',
                    subreddit: post.subreddit
                });
                if (flairFilter.filter()) {
                    this.filteredPosts.push(post);
                }
                continue;
            }

            if (this.ddMode) {
                // Not supported yet
                continue;
            }
        }
        return this.filteredPosts;
    }

    isSticked(post: Socials.Reddit.Snoowrap.Types.Post) {
        return post.stickied;
    }
};
