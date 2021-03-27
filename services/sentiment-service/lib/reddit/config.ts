export interface SubredditConfigSchema {
  name: string;
  whitelist: string[];
}

export const config = {
  subreddits: {
    wallstreetbets: {
      name: 'wallstreetbets',
      whitelist: ['moon', 'diamond-hands'],
      phraseList: ['to the moon', 'too the moon', 'diamond hands', 'hold the line']
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
  ],
  commonMissHitWords: ['stock'],
  tickerFilterPatterns: ['$']
};
