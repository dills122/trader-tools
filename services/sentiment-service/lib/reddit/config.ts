
export interface SubredditConfigSchema {
    name: string,
    whitelist: string[]
}

export const config = {
    subreddits: {
        wallstreetbets: {
            name: 'wallstreetbets',
            whitelist: ['moon', 'diamond-hands']
        }
    },
    supportedSubreddits: [
        'RedditTickers',
        'SPACs',
        'dividends',
        'investing',
        'pennystocks',
        'smallstreetbets',
        'stocks',
        'stonks',
        'wallstreetbets'
    ]
};