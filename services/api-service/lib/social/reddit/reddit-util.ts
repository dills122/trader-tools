import { isRedditPostSchema, RedditEntitySchema } from "./reddit-types";

export const gatherRedditPostURLs = (aggregatedPosts: RedditEntitySchema[]) => {
    const posts = aggregatedPosts.map((entity) => {
        return entity.data;
    });
    if (!isRedditPostSchema(posts)) {
        throw Error('Incompatible type');
    }
    return posts.map((post) => {
        return post.url;
    });
};

export const gatherPostsComments = (aggregatedPosts: RedditEntitySchema[]) => {
    const commentEntities = aggregatedPosts.filter((entity) => {
        return entity.kind === 't1';
    });
    return commentEntities.map((entity) => {
        return {
            subreddit: entity.data.subreddit,
            comment: entity.data.body
        };
    });
};

export const trimAndFixUrl = (url: string, format: 'json' | 'xml' = 'json') => {
    const isSlash = url.slice(-1) === '/';
    let modifiedURL = url;
    if (isSlash) {
        modifiedURL = modifiedURL.slice(0, url.length - 1);
    }
    return `${modifiedURL}.${format}`;
};