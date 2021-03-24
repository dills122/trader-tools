import { polygonIOApiRequest } from './base-request.service';
import { Logger } from 'trader-sdk';

const log = new Logger.default({
    isPretty: true,
    name: 'Polygon-IO Ticker News'
});

export const getTickerNewsItems = async (ticker: string) => {
    try {
        const resp = await polygonIOApiRequest<TickerNewsItemResponse[]>(`/meta/symbols/${ticker}/news`, {}, 'v1');
        return resp;
    } catch (err) {
        log.error(err);
        throw err;
    }
};

export interface TickerNewsItemResponse {
    symbols: string[],
    timestamp: string,
    title: string,
    url: string,
    source: string,
    summary: string,
    image: string,
    keywords: string[]
};
