import got from 'got';
import { isRedditPostSchema, RedditPostSchema, RedditRawResult } from './reddit-types';

const baseURL = 'https:://www.reddit.com/r/';

const kindMapping = {
    t1: 'comment',
    t2: 'account',
    t3: 'link',
    t4: 'message',
    t5: 'subreddit',
    t6: 'award'
};

const subreddits = [
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

export const getFrontPageOfSubreddit = async (subreddit: string): Promise<RedditRawResult> => {
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

export const getAllSubredditsFrontPages = async (): Promise<RedditPostSchema[]> => {
    let aggregatedPosts: RedditPostSchema[] = []; // TODO update type 
    for (let subreddit of subreddits) {
        try {
            const { data } = await getFrontPageOfSubreddit(subreddit);
            if (!data) {
                continue; // Fail forward
            }
            const { children } = data;
            const filterNonPostEntities = children.filter((entity) => {
                return isRedditPostSchema(entity.data);
            });
            const mappedFilteredPosts = filterNonPostEntities.map((entity) => {
                return entity.data;
            });
            if (!isRedditPostSchema(mappedFilteredPosts)) {
                continue;
            }
            aggregatedPosts = aggregatedPosts.concat(mappedFilteredPosts);
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