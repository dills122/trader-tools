import * as dotenv from 'dotenv';
import got from 'got';

const baseURL = "https://socialsentiment.io/api/";

dotenv.config({ path: __dirname + '/../../../../.env' });

const pk = process.env.SOCIAL_SENTIMENT_API;
const apiversion = process.env.SOCIAL_SENTIMENT_API_VERSION;

export const rateLimit = (): number => {
    const planType = process.env.SOCIAL_SENTIMENT_PLAN || 'BASIC';
    switch (planType) {
        case 'BASIC':
            return 25;
        default:
            return 25;
    }
};

export const authPlugin = got.extend({
    hooks: {
        beforeRequest: [
            options => {
                options.headers['Authorization'] = `Token ${pk}`;
            }
        ]
    }
});

//This is a premium endpoint only, and currently not supported with the plan I have
export const trendingStocksSentiment = async (
    source: 'twitter' | 'reddit'
): Promise<StockSentimentResult[]> => {
    const url = `${baseURL}${apiversion}/stocks/trending/${source}/`;
    const resp = await authPlugin.get(url);
    return JSON.parse(resp.body);
};

export const dailyStockSentiment = async (
    page: number
): Promise<DailyStockSentimentResults> => {
    const url = `${baseURL}${apiversion}/stocks/sentiment/daily/`;
    const resp = await authPlugin.get(url, {
        searchParams: {
            page
        }
    });
    return JSON.parse(resp.body);
};

export interface DailyStockSentimentResults {
    count: number,
    next: string,
    previous: string,
    results: StockSentimentResult[]
}

export interface StockSentimentResult {
    stock: string,
    date: string,
    score: number,
    positive_score: number,
    negative_score: number,
    activity: number,
    avg_7_days: number,
    avg_14_days: number,
    avg_30_days: number
}