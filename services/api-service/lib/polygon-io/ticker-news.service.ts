import { polygonIOApiRequest } from './base-request.service';

export const getTickerNewsItems = async (ticker: string) => {
    try {
        const resp = await polygonIOApiRequest<TickerNewsItemResponse[]>(`/meta/symbols/${ticker}/news`, {}, 'v1');
        return resp;
    } catch (err) {
        console.error(err);
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
