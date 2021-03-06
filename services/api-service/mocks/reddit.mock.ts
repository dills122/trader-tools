import { RedditCommentSchema, RedditCommentSchemaExtended, RedditLinkSchema, RedditPostAndThreadSchema, RedditRawResult } from "../lib/social/reddit/reddit-types";
import _ from 'lodash';

export const RedditRawResultBase: RedditRawResult = {
    kind: 'Listing',
    data: {
        modhash: 'HASH',
        dist: 1,
        children: new Array()
    }
};

export const RedditLinkSchemaBase: RedditLinkSchema = {
    kind: 't3',
    data: {
        score: 0,
        ups: 0,
        downs: 0,
        upvote_ratio: 0,
        subreddit: 'subreddit',
        body: 'This is a body',
        stickied: false,
        selftext: '',
        title: 'Title',
        link_flair_text: '',
        preview: {
            images: []
        },
        media: {},
        is_video: false,
        permalink: 'url.url/',
        url: 'url.url/'
    }
};

export const RedditCommentSchemaBase: RedditCommentSchema = {
    kind: "t1",
    data: {
        score: 0,
        ups: 0,
        downs: 0,
        upvote_ratio: 0,
        subreddit: 'sbureddit',
        body: 'This is a body',
        stickied: false
    }
};
export const RedditCommentSchemaExtendedBase: RedditCommentSchemaExtended = {
    kind: "t1",
    data: {
        score: 0,
        ups: 0,
        downs: 0,
        upvote_ratio: 0,
        subreddit: 'sbureddit',
        body: 'This is a body',
        stickied: false
    },
    tickerSymbol: ''
};

export const RedditPostAndThreadSchemaBase: RedditPostAndThreadSchema = {
    body: '',
    title: '',
    discussion: []
};

export const getCommentList = (size: number, subreddit?: string) => {
    const comments: RedditCommentSchema[] = [];
    for (let i = 0; i < size; i++) {
        const clonedSchema = _.cloneDeep(RedditCommentSchemaBase);
        if (subreddit) {
            clonedSchema.data.subreddit = subreddit;
        }
        comments.push(clonedSchema);
    }
    return comments;
};

export const getExtendedCommentList = (size: number, subreddit?: string, symbol?: string) => {
    const comments: RedditCommentSchemaExtended[] = [];
    for (let i = 0; i < size; i++) {
        const clonedSchema = _.cloneDeep(RedditCommentSchemaExtendedBase);
        if (subreddit) {
            clonedSchema.data.subreddit = subreddit;
        }
        if (symbol) {
            clonedSchema.tickerSymbol = symbol;
        }
        comments.push(clonedSchema);
    }
    return comments;
};

export const getLinkList = (size: number, subreddit?: string) => {
    const links: RedditLinkSchema[] = [];
    for (let i = 0; i < size; i++) {
        const clonedSchema = _.cloneDeep(RedditLinkSchemaBase);
        if (subreddit) {
            clonedSchema.data.subreddit = subreddit;
        }
        links.push(clonedSchema);
    }
    return links;
};

export const getRawResult = (type: 'comment' | 'link', size: number = 5, subreddit?: string): RedditRawResult => {
    const cloned = _.cloneDeep(RedditRawResultBase);
    cloned.data.children = [];
    if (type === 'comment') {
        const comments = getCommentList(size, subreddit);
        cloned.data.children = comments;
        return cloned;
    } else {
        const links = getLinkList(size, subreddit);
        cloned.data.children = links;
        return cloned;
    }
};

export const getRedditPostAndThreadResult = (title: string, body: string, size: number = 5, subreddit?: string) => {
    const cloned = _.cloneDeep(RedditPostAndThreadSchemaBase);
    cloned.title = title;
    cloned.body = body;
    cloned.discussion = getCommentList(size, subreddit);
    return cloned;
};
