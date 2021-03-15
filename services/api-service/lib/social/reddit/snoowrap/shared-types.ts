
export interface VotableContent {
    ups: number,
    downs: number,
    score: number,
    user: string,
    timestamp: string
};

export interface Post extends VotableContent {
    title: string,
    body: string,
    flair?: string,
    user: string,
    isMultiMedia: boolean
    stickied: boolean,
    url: string,
    hidden: boolean,
    locked: boolean,
    comments: Comment[]
};

export interface Comment extends VotableContent {
    body: string,
    spam: boolean,
    removed: boolean,
    approved: boolean,
    isSubmitter: boolean
};

