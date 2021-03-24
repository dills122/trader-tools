import { polygonIOApiRequest } from './base-request.service';
import { Logger } from 'trader-sdk';

const log = new Logger.default({
    isPretty: true,
    name: 'Polygon-IO Historic Quote'
});

export const getHistoricQuote = async (ticker: string, date: string = new Date().toLocaleDateString("en-US")) => {
    try {
        const resp = await polygonIOApiRequest<HistoricQuoteResponse>(`/open-close/${ticker}/${date}`, {}, 'v1');
        return resp;
    } catch (err) {
        log.error(err);
        throw err;
    }
};

export interface HistoricQuoteResponse {
    status: string,
    from: string,
    symbol: string,
    open: number,
    high: number,
    low: number,
    close: number,
    volume: number,
    afterHours: number,
    preMarket: number
};
