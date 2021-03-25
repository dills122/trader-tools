
export const trimAndFixUrl = (url: string, format: 'json' | 'xml' = 'json'): string => {
    const isSlash = url.slice(-1) === '/';
    let modifiedURL = url;
    if (isSlash) {
        modifiedURL = modifiedURL.slice(0, url.length - 1);
    }
    return `${modifiedURL}.${format}`;
};

export const trimSubredditName = (subreddit: string): string => {
    if (!subreddit.includes('r/')) {
        return subreddit;
    }
    return subreddit.replace('r/', '');
};
