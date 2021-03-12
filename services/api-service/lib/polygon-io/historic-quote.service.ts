import { polygonIOApiRequest } from './base-request.service';

export const getHistoricQuote = async (ticker: string, date: string = new Date().toLocaleDateString("en-US")) => {
    try {
        const resp = await polygonIOApiRequest<HistoricQuoteResponse>(`/open-close/${ticker}/${date}`, {}, 'v1');
        return resp;
    } catch (err) {
        console.error(err);
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
