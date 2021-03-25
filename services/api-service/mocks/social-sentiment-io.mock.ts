import { DailyStockSentimentResults, StockSentimentResult } from "../lib/sentiment-analysis/social-sentiment-io.service";
import _ from 'lodash';

export const DailyStockSentimentResultsBase: DailyStockSentimentResults = {
    count: 0,
    next: '',
    previous: '',
    results: []
};

export const StockSentimentResultBase: StockSentimentResult = {
    stock: 'SYMBOL',
    date: '',
    score: 1,
    positive_score: 1,
    negative_score: 0,
    activity: 10,
    avg_7_days: 5,
    avg_14_days: 5,
    avg_30_days: 5
};

export const getStockSentimentResultList = (tickerSymbols: string[]) => {
    const results: StockSentimentResult[] = [];
    for (const symbol of tickerSymbols) {
        const clonedSentimentResult = _.cloneDeep(StockSentimentResultBase);
        clonedSentimentResult.stock = symbol;
        results.push(clonedSentimentResult);
    }
    return results;
};

export const getDailyStockSentimentResults = (tickerSymbols: string[], length: number = tickerSymbols.length) => {
    const clonedObj = _.cloneDeep(DailyStockSentimentResultsBase);
    clonedObj.count = length;
    clonedObj.results = [];
    for (const symbol of tickerSymbols) {
        const clonedSentimentResult = _.cloneDeep(StockSentimentResultBase);
        clonedSentimentResult.stock = symbol;
        clonedObj.results.push(clonedSentimentResult);
    }
    return clonedObj;
};
