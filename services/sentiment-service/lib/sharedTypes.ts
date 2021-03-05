export type serviceAnalysisType = 'front-page';
export type socialSourceType = 'reddit';
export type analyzerType = 'natural';

export interface SentimentAnalysisFilterFlags extends SentimentAnalysisFilterFlagsModeType, SentimentAnalysisFilterFlagsFilterType { };

export interface SentimentAnalysisFilterFlagsModeType {
    discussionMode?: boolean,
    chaosMode?: boolean,
    ddMode?: boolean
};

export interface SentimentAnalysisFilterFlagsFilterType {
    matureFilter?: boolean,
    emojiFilter?: boolean,
    hashtagFilter?: boolean
};