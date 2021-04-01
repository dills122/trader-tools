import { StandardizeInputOptions } from './standardize-input';

export type serviceAnalysisType = 'front-page';
export type socialSourceType = 'reddit';
export type analyzerType = 'natural';

export type sentimentStatusType = 'netural' | 'positive' | 'very-positive' | 'negative' | 'very-negative';

export interface SentimentAnalysisFilterFlags
  extends SentimentAnalysisFilterFlagsModeType,
    SentimentAnalysisFilterFlagsFilterType {}

export interface SentimentAnalysisFilterFlagsModeType {
  discussionMode?: boolean;
  chaosMode?: boolean;
  ddMode?: boolean;
}

export interface SentimentAnalysisFilterFlagsFilterType {
  matureFilter?: boolean;
  emojiFilter?: boolean;
  hashtagFilter?: boolean;
}

export interface GenericSentimentAnalysisResult {
  content: string;
  stanardizedContent: string[];
  symbol: string;
  sentimentStatus: string;
  score: number;
  source: socialSourceType;
  sourceKey: string;
  title?: string;
}

export interface AggregatedRefinedSentimentData {
  symbol: string;
  conversationEntityCount: number;
  conversationPostiveCount: number;
  conversationNegativeCount: number;
  conversationNeutralCount: number;
  positiveSentiment: number;
  negativeSentiment: number;
  neutralSentiment: number;
  sentimentScore: number;
}

export type AnalyzerOptions = StandardizeInputOptions;

export interface FlagsAndOptions {
  filterFlags?: SentimentAnalysisFilterFlags;
  analyzerOptions?: AnalyzerOptions;
  equityWhitelist?: string[];
  equityWhitelistEnabled?: boolean;
}
