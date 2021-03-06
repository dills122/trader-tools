import { SentimentAnalyzer, PorterStemmer } from 'natural';
import { sentimentStatusType } from './sharedTypes';

export const SentimentConfig = {
    veryPositive: 0.85,
    positive: 0.35,
    negative: - 0.35,
    veryNegative: -0.85
};

export interface SentimentAnalysisResult {
    status: sentimentStatusType,
    score: number,
    standardizedInput: string
};

export const analyze = (standardizedInput: string[]): SentimentAnalysisResult => {
    const analyzer = new SentimentAnalyzer('English', PorterStemmer, 'afinn');
    const analysis = analyzer.getSentiment(standardizedInput);
    // Netural Area
    if (analysis >= SentimentConfig.negative && analysis <= SentimentConfig.positive) {
        return {
            status: 'netural',
            score: analysis,
            standardizedInput: standardizedInput.join(' ')
        };
    }
    const isPositive = SentimentConfig.positive <= analysis;
    const isVeryPositive = SentimentConfig.veryPositive <= analysis;
    const isVeryNegative = SentimentConfig.veryNegative <= analysis;
    if (isPositive) {
        return {
            status: isVeryPositive ? 'very-positive' : 'positive',
            score: analysis,
            standardizedInput: standardizedInput.join(' ')
        }
    }

    return {
        status: isVeryNegative ? 'very-negative' : 'negative',
        score: analysis,
        standardizedInput: standardizedInput.join(' ')
    };
};