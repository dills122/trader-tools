import { RedditCommentSchema, RedditLinkSchema, RedditRawResult } from "../lib/social/reddit/reddit-types";

export const RedditRawResultBase = {
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

export const getCommentList = (size: number) => {
    const comments: RedditCommentSchema[] = [];
    for (let i = 0; i < size; i++) {
        comments.push(RedditCommentSchemaBase);
    }
    return comments;
};

export const getLinkList = (size: number) => {
    const links: RedditLinkSchema[] = [];
    for (let i = 0; i < size; i++) {
        links.push(RedditLinkSchemaBase);
    }
    return links;
};

export const getRawResult = (type: 'comment' | 'link', size: number = 5): RedditRawResult => {
    RedditRawResultBase.data.children = type === 'comment' ? getCommentList(size) : getLinkList(size);
    return RedditRawResultBase;
};
