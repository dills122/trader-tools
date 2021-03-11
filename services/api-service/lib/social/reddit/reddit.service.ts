import got from 'got';
import { isRedditLinkSchemaList, isRedditCommentSchemaList, RedditCommentSchema, RedditLinkSchema, RedditRawResult, RedditRawResults, isRedditLinkSchema, RedditPostAndThreadSchema } from './reddit-types';
import * as util from './reddit-util';

export const baseURL = 'https://www.reddit.com/r/';

// const kindMapping = {
//     t1: 'comment',
//     t2: 'account',
//     t3: 'link',
//     t4: 'message',
//     t5: 'subreddit',
//     t6: 'award'
// };

export const subredditsConfig = [
    'RedditTickers',
    'SPACs',
    'dividends',
    'investing',
    'pennystocks',
    'smallstreetbets',
    'stocks',
    'stonks',
    'wallstreetbets'
];

export const getSubreddits = () => {
    return subredditsConfig;
};

export const getFrontPageOfSubreddit = async (subreddit: string): Promise<RedditRawResult> => {
    const subreddits = getSubreddits();
    if (!subreddits.includes(subreddit)) {
        throw Error('Unsupported subreddit');
    }
    try {
        const resp = await got.get(`${baseURL}${subreddit}.json`);
        return JSON.parse(resp.body);
    } catch (err) {
        throw err;
    }
};

export const getAllSubredditsFrontPages = async (): Promise<RedditLinkSchema[]> => {
    const subreddits = getSubreddits();
    let aggregatedPosts: RedditLinkSchema[] = [];
    for (let subreddit of subreddits) {
        try {
            const { data } = await getFrontPageOfSubreddit(subreddit);
            if (!data) {
                continue; // Fail forward
            }
            const { children } = data;
            const filterNonPostEntities = children.filter((entity) => {
                return entity.kind === 't3';
            });
            if (!isRedditLinkSchemaList(filterNonPostEntities)) {
                continue;
            }
            aggregatedPosts = aggregatedPosts.concat(filterNonPostEntities);
        } catch (err) {
            console.error(err);
            continue;
        }
    }
    if (aggregatedPosts.length <= 0) {
        throw Error('Issue with data source, no results returned');
    }
    return aggregatedPosts;
};

export const getDiscussionCommentThread = async (url: string): Promise<RedditCommentSchema[]> => {
    try {
        if (!url.includes(baseURL)) {
            throw Error('Unsupported URL');
        }
        if (!url.includes('json')) {
            url = util.trimAndFixUrl(url);
        }
        const resp = await got.get(`${url}`);
        const rawResults: RedditRawResults = JSON.parse(resp.body);

        if (rawResults.length <= 0 || rawResults.length > 2) {
            throw Error('Unexpected data structure returned');
        }

        const commentsEntity = rawResults[1];

        if (!commentsEntity || !isRedditCommentSchemaList(commentsEntity.data.children)) {
            throw Error('Mismatched returned data');
        }
        return commentsEntity.data.children;
    } catch (err) {
        throw err;
    }
};

export const getPostAndCommentThread = async (url: string): Promise<RedditPostAndThreadSchema> => {
    try {
        if (!url.includes(baseURL)) {
            console.error(url);
            throw Error('Unsupported URL');
        }
        if (!url.includes('json')) {
            url = util.trimAndFixUrl(url);
        }
        const resp = await got.get(`${url}`);
        const rawResults: RedditRawResults = JSON.parse(resp.body);

        if (rawResults.length <= 0 || rawResults.length > 2) {
            throw Error('Unexpected data structure returned');
        }

        const [postEntity, commentsEntity] = rawResults;

        const postData = postEntity.data.children[0];

        if (!isRedditLinkSchema(postData)) {
            throw Error('No post info found');
        }

        const trimedArray = commentsEntity.data.children.filter(comment => comment.kind === 't1');

        if (!isRedditCommentSchemaList(trimedArray)) {
            throw Error('Mismatched returned data');
        }
        return {
            title: postData.data.title,
            body: postData.data.selftext,
            discussion: trimedArray
        };
    } catch (err) {
        throw err;
    }
};