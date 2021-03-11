
export type RedditRawResults = RedditRawResult[];

export interface RedditLinkSchema {
    kind: 't3',
    data: {
        score: number,
        ups: number,
        downs: number,
        upvote_ratio: number,
        subreddit: string,
        body: string,
        stickied: boolean,
        selftext: string,
        title: string,
        link_flair_text: string,
        preview: {
            images: object[]
        },
        media: object,
        is_video: boolean,
        permalink: string,
        url: string
    }
};
export interface RedditCommentSchema {
    kind: 't1',
    data: {
        score: number,
        ups: number,
        downs: number,
        upvote_ratio: number,
        subreddit: string,
        body: string,
        stickied: boolean
    }
};

export interface RedditRawResult {
    kind: string,
    data: {
        modhash: string,
        dist: number,
        children: Array<RedditLinkSchema> | Array<RedditCommentSchema> | Array<(RedditLinkSchema | RedditCommentSchema)>
    }
};

export interface RedditPostAndThreadSchema {
    title: string,
    body: string,
    discussion: RedditCommentSchema[]
};

export interface RedditCommentSchemaExtended extends RedditCommentSchema {
    tickerSymbol: string
};

export const isRedditLinkSchemaList = (arg: any): arg is RedditLinkSchema[] => {
    if (!Array.isArray(arg)) {
        return false;
    }
    return arg.every(item => item && item.kind && item.kind === 't3' && item.data);
};

export const isRedditCommentSchemaList = (arg: any): arg is RedditCommentSchema[] => {
    if (!Array.isArray(arg)) {
        return false;
    }
    return arg.every(item => item && item.kind && item.kind === 't1' && item.data && item.data.body);
};

export const isRedditLinkSchema = (arg: any): arg is RedditLinkSchema => {
    return arg.kind === 't3';
};

export const isRedditCommentSchema = (arg: any): arg is RedditCommentSchema => {
    return arg.kind === 't1';
};