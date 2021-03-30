import { SentimentAnalyzer as Analyzer, PorterStemmer } from 'natural';
import { SentimentConfig } from './sentiment.config';
import { sentimentStatusType } from './shared-types';

export interface SentimentAnalysisResult {
  status: sentimentStatusType;
  score: number;
  standardizedInput: string;
}

export class SentimentAnalyzer {
  private analyzer: Analyzer;
  constructor() {
    this.analyzer = new Analyzer('English', PorterStemmer, 'afinn');
  }

  analyze(standardizedInput: string[]): SentimentAnalysisResult {
    const analysis = this.analyzer.getSentiment(standardizedInput);
    // Netural Area
    if (analysis > SentimentConfig.negative && analysis < SentimentConfig.positive) {
      return {
        status: 'netural',
        score: analysis,
        standardizedInput: standardizedInput.join(' ')
      };
    }
    const isPositive = SentimentConfig.positive <= analysis;
    const isVeryPositive = SentimentConfig.veryPositive <= analysis;
    const isVeryNegative = SentimentConfig.veryNegative >= analysis;
    if (isPositive) {
      return {
        status: isVeryPositive ? 'very-positive' : 'positive',
        score: analysis,
        standardizedInput: standardizedInput.join(' ')
      };
    }

    return {
      status: isVeryNegative ? 'very-negative' : 'negative',
      score: analysis,
      standardizedInput: standardizedInput.join(' ')
    };
  }
}
