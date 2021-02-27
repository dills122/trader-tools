import got from 'got';

const baseURL = 'https:://www.reddit.com/r/';

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

export const getFrontPageOfSubreddit = async (subreddit: string) => {
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

export const getAllSubredditsFrontPages = async () => {
    let aggregatedPosts: object[] = []; // TODO update type 
    for (let subreddit of subreddits) {
        try {
            const { data } = await getFrontPageOfSubreddit(subreddit);
            if (!data) {
                continue; // Fail forward
            }
            const { children } = data;
            if (children && Array(children).length > 0) {
                aggregatedPosts = aggregatedPosts.concat(children);
            }
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