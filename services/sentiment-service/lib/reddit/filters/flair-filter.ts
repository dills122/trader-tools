import _ from "lodash";

export const flairConfig = {
    subreddits: {
        'wallstreetbets': {
            good: ['chart', 'news', 'discussion', 'dd', 'weekend discussion'],
            bad: ['meme', 'shitpost'],
            netural: ['loss', 'gain', 'yolo'],
            discussion: ['discussion', 'weekend discussion']
        }
    }
}

export interface FlairConfigSubredditItem {
    good: string[],
    bad: string[],
    netural: string[],
    discussion: string[]
}

export interface FlairFilterArgs {
    flair: string,
    subreddit: string,
    filterType: 'shitpost' | 'discussion' | 'chaos'
    /**
     * Filter Type descriptions
     * shitpost: no shitposts or memes
     * discussion: only looking for discussion/news types
     * chaos: only going for shitposting/memeing type posts
     */
}

export class FlairFilter {
    private flair: string;
    private subreddit: string;
    private filterType: string;
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
            case 'shitpost':
                return this.shitpostMode();
            case 'discussion':
                return this.discussionMode();
            case 'chaos':
                return this.chaosMode();
            default:
                throw Error('Unsupported filter type');
        }
    }

    private shitpostMode() {
        return this.subredditConfig.good.includes(this.flair) ||
            this.subredditConfig.netural.includes(this.flair);
    }

    private discussionMode() {
        return this.subredditConfig.discussion.includes(this.flair);
    }

    private chaosMode() {
        return this.subredditConfig.bad.includes(this.flair);
    }

    private checkSubreddit() {
        const supportedSubreddits = _.keys(flairConfig.subreddits);
        if (!supportedSubreddits.includes(this.subreddit)) {
            throw Error('Unsupported subreddit');
        }
    }
}