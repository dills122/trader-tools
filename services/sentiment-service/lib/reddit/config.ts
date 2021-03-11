
export interface SubredditConfigSchema {
    name: string,
    whitelist: string[]
};

export const config = {
    subreddits: {
        wallstreetbets: {
            name: 'wallstreetbets',
            whitelist: ['moon', 'diamond-hands']
        }
    }
};