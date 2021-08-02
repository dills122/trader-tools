// Original file: src/protos/generic/generic.proto

export interface SentimentAnalysisResult {
  content?: string;
  stanardizedContent?: string[];
  symbol?: string;
  sentimentStatus?: string;
  score?: number | string;
  source?: string;
  sourceKey?: string;
  title?: string;
}

export interface SentimentAnalysisResult__Output {
  content: string;
  stanardizedContent: string[];
  symbol: string;
  sentimentStatus: string;
  score: number;
  source: string;
  sourceKey: string;
  title: string;
}
