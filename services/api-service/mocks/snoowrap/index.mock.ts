import _ from "lodash";
import { Post, Comment, CommentExtended } from "../../lib/social/reddit/snoowrap/shared-types";

export const PostBase: Post = {
    body: '',
    title: '',
    hidden: false,
    stickied: false,
    locked: false,
    isMultiMedia: false,
    timestamp: '',
    downs: 100,
    ups: 100,
    score: 0,
    url: '',
    user: '',
    flair: '',
    subreddit: '',
    comments: []
};

export const CommentBase: Comment = {
    approved: true,
    body: 'This is a body',
    downs: 100,
    ups: 100,
    isSubmitter: false,
    removed: false,
    score: 0,
    spam: false,
    stickied: false,
    timestamp: '',
    user: '',
    subreddit: ''
};

export const CommentExtendedBase: CommentExtended = {
    ...CommentBase,
    tickerSymbol: ''
};

export const getCommentList = (size: number, subreddit?: string) => {
    const comments: Comment[] = [];
    for (let i = 0; i < size; i++) {
        const clonedSchema = _.cloneDeep(CommentBase);
        if (subreddit) {
            clonedSchema.subreddit = subreddit;
        }
        comments.push(clonedSchema);
    }
    return comments;
};

export const getCommentListExtended = (size: number, tickerSymbol: string, subreddit?: string) => {
    const comments: CommentExtended[] = [];
    for (let i = 0; i < size; i++) {
        const clonedSchema = _.cloneDeep(CommentExtendedBase);
        if (subreddit) {
            clonedSchema.subreddit = subreddit;
        }
        clonedSchema.tickerSymbol = tickerSymbol;
        comments.push(clonedSchema);
    }
    return comments;
};

export const getPostList = (size: number, subreddit?: string, comments?: Comment[]) => {
    const posts: Post[] = [];
    for (let i = 0; i < size; i++) {
        const clonedSchema = _.cloneDeep(PostBase);
        if (subreddit) {
            clonedSchema.subreddit = subreddit;
        }
        if (comments) {
            clonedSchema.comments = _.cloneDeep(comments);
        }
        posts.push(clonedSchema);
    }
    return posts;
};

export const getPostAndCommentList = (postCount: number = 5, commentCount: number = 10, subreddit?: string) => {
    const comments = getCommentList(commentCount, subreddit);
    return getPostList(postCount, subreddit, comments);
};
