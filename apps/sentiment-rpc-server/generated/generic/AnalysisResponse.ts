// Original file: src/protos/generic/generic.proto

import type {
  SentimentAnalysisResult as _generic_SentimentAnalysisResult,
  SentimentAnalysisResult__Output as _generic_SentimentAnalysisResult__Output
} from '../generic/SentimentAnalysisResult';

export interface AnalysisResponse {
  analysisResults?: _generic_SentimentAnalysisResult[];
}

export interface AnalysisResponse__Output {
  analysisResults: _generic_SentimentAnalysisResult__Output[];
}
