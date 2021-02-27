
export type RedditRawResults = RedditRawResult[];

export interface RedditEntitySchema {
    kind: string,
    data: RedditPostSchema | RedditLinkSchema | RedditCommentSchema
};

export interface RedditRawResult {
    kind: string,
    data: {
        modhash: string,
        dist: number,
        children: RedditEntitySchema[]
    }
};

export interface RedditLinkSchema {
    score: number,
    ups: number,
    downs: number,
    upvote_ratio: number,
    subreddit: string,
    body: string,
    stickied: boolean,
    selftext: string
};

export interface RedditCommentSchema {
    score: number,
    ups: number,
    downs: number,
    upvote_ratio: number,
    subreddit: string,
    body: string,
    stickied: boolean
};

export interface RedditPostSchema {
    title: string,
    score: number,
    ups: number,
    downs: number,
    upvote_ratio: number,
    subreddit: string,
    url: string,
    stickied: boolean,
    body: string
};

export const isRedditPostSchema = (arg: any): arg is RedditPostSchema[] => {
    if (!Array.isArray(arg)) {
        return false;
    }
    return arg.every(item => item && item.url && item.title);
};

export const isRedditCommentSchema = (arg: any): arg is RedditCommentSchema[] => {
    if (!Array.isArray(arg)) {
        return false;
    }
    return arg.every(item => item && !item.url && !item.title && !item.selftext);
};

export const isRedditLinkSchema = (arg: any): arg is RedditLinkSchema[] => {
    if (!Array.isArray(arg)) {
        return false;
    }
    return arg.every(item => item && !item.url && !item.title && item.selftext);
};