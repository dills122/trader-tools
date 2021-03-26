import { Socials } from 'api-service';
import _ from 'lodash';
import { SentimentAnalysisFilterFlags } from '../../sharedTypes';
import { FlairFilter } from './flair-filter';

export interface PostFilterArgs extends SentimentAnalysisFilterFlags {
    posts: Socials.Reddit.Types.Post[]
}

export class PostFilter {
    private discussionMode: boolean;
    private chaosMode: boolean;
    private ddMode: boolean;
    private posts: Socials.Reddit.Types.Post[];
    private filteredPosts: Socials.Reddit.Types.Post[] = [];

    constructor(args: PostFilterArgs) {
        _.assign(this, args);
    }

    filter(): Socials.Reddit.Types.Post[] {
        for (const post of this.posts) {
            //TODO reimplement this feature
            // if (this.stickedMode && this.isSticked(post)) {
            //     this.filteredPosts.push(post);
            //     continue;
            // }
            try {
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
            } catch (err) {
                console.error(err);
                // continue;
                throw err;
            }
        }
        return this.filteredPosts;
    }

    isSticked(post: Socials.Reddit.Types.Post): boolean {
        return post.stickied;
    }
}
