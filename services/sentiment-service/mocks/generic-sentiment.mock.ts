import _ from 'lodash';
import { GenericSentimentAnalysisResult } from '../lib/shared-types';

export const GenericSentimentAnalysisResultBase: GenericSentimentAnalysisResult = {
  content: '',
  stanardizedContent: [],
  symbol: '',
  sentimentStatus: '',
  score: 0,
  source: 'reddit',
  sourceKey: 'wallstreetbets',
  title: ''
};

export const getGenericSentimentResult = (symbol?: string, score = 0.8): GenericSentimentAnalysisResult => {
  const obj = _.cloneDeep(GenericSentimentAnalysisResultBase);
  if (symbol) {
    obj.symbol = symbol;
  }
  obj.score = score;
  return obj;
};

export const getGenericSentimentResultList = (
  size = 5,
  symbol?: string,
  score = 0.8
): GenericSentimentAnalysisResult[] => {
  const genericSentimentList: GenericSentimentAnalysisResult[] = [];
  for (let i = 0; i < size; i++) {
    genericSentimentList.push(getGenericSentimentResult(symbol, score));
  }
  return genericSentimentList;
};
