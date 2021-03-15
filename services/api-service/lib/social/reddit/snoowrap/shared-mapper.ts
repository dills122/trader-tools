import snoowrap, { Submission } from "snoowrap";
import { Comment, Post } from "./shared-types";

export const mapPost = (apiSchema: Submission): Post => {
    const comments: Comment[] = [];
    for (let comment of apiSchema.comments) {
        comments.push(mapComment(comment));
    }
    let schema = {
        body: apiSchema.selftext,
        title: apiSchema.title,
        hidden: apiSchema.hidden,
        stickied: apiSchema.stickied,
        locked: apiSchema.locked,
        isMultiMedia: !!apiSchema.media,
        timestamp: String(apiSchema.created),
        downs: apiSchema.downs,
        ups: apiSchema.ups,
        score: apiSchema.score,
        url: apiSchema.url,
        user: apiSchema.author.name,
        flair: apiSchema.link_flair_text || undefined,
        comments
    };
    return schema;
};

export const mapComment = (apiSchema: snoowrap.Comment): Comment => {
    return {
        approved: apiSchema.approved,
        body: apiSchema.body,
        downs: apiSchema.downs,
        ups: apiSchema.ups,
        isSubmitter: apiSchema.is_submitter,
        removed: apiSchema.removed,
        score: apiSchema.score,
        spam: apiSchema.spam,
        timestamp: String(apiSchema.created),
        user: apiSchema.author.name
    };
};
