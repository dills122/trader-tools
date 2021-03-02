import { Socials } from 'api-service';
import _ from 'lodash';
import { FlairFilter } from './flair-filter';

export interface PostFilterArgs {
    posts: Socials.Reddit.Types.RedditLinkSchema[],
    stickedMode?: boolean,
    nonShitpostingMode?: boolean,
    discussionOnlyMode?: boolean,
    ddMode?: boolean
};

/**
 * Sticked Post Filter
 * Non-shitposting Filter
 * Discussion Only Filter
 * DD Filter
 */

export class PostFilter {
    private stickedMode: boolean;
    private nonShitpostingMode: boolean;
    private discussionOnlyMode: boolean;
    private ddMode: boolean;
    private posts: Socials.Reddit.Types.RedditLinkSchema[];
    private filteredPosts: Socials.Reddit.Types.RedditLinkSchema[] = [];
    constructor(args: PostFilterArgs) {
        this.posts = args.posts;
        const modes = this.setupModeValues(args);
        _.assign(this, modes);
    }

    private setupModeValues(args: PostFilterArgs) {
        if (args.ddMode) {
            return {
                ddMode: true
            };
        }
        if (args.stickedMode) {
            return {
                stickedMode: true,
                nonShitpostingMode: args.nonShitpostingMode
            };
        }
        if (args.discussionOnlyMode) {
            return {
                discussionOnlyMode: true,
                nonShitpostingMode: args.nonShitpostingMode
            };
        }
        return {};
    };

    filter() {
        for (let post of this.posts) {
            if (this.stickedMode && this.isSticked(post)) {
                this.filteredPosts.push(post);
                continue;
            }
            if (this.discussionOnlyMode) {
                const flairFilter = new FlairFilter({
                    filterType: 'discussion',
                    flair: post.data.link_flair_text,
                    subreddit: post.data.subreddit
                });
                if (flairFilter.filter()) {
                    this.filteredPosts.push(post);
                }
                continue;
            }
            if (this.nonShitpostingMode) {
                const flairFilter = new FlairFilter({
                    filterType: 'shitpost',
                    flair: post.data.link_flair_text,
                    subreddit: post.data.subreddit
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
            if (!this.ddMode && !this.discussionOnlyMode &&
                !this.nonShitpostingMode && !this.stickedMode) {
                // Default is chaos filter
                const flairFilter = new FlairFilter({
                    filterType: 'chaos',
                    flair: post.data.link_flair_text,
                    subreddit: post.data.subreddit
                });
                if (flairFilter.filter()) {
                    this.filteredPosts.push(post);
                }
            }
        }
        return this.filteredPosts;
    }

    isSticked(post: Socials.Reddit.Types.RedditLinkSchema) {
        return post.data.stickied;
    }
};