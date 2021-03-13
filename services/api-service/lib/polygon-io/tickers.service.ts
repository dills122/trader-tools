import { polygonIOApiRequest } from './base-request.service';
//https://polygon.io/docs/get_v2_reference_tickers_anchor

export interface TickerSymbolRequestOptions {
    sort?: '-ticker' | 'ticker' | 'type',
    type?: 'CS' | 'REIT' | 'PUB', // https://polygon.io/docs/get_v2_reference_types_anchor
    market?: 'stocks' | 'crypto' | 'fx',
    locale?: 'us' | 'g'
};

export const getTickerSymbolPage = async (page: number, options?: TickerSymbolRequestOptions) => {
    try {
        const resp = await polygonIOApiRequest<RawTickerPageResponse>('/reference/tickers', {
            page,
            ...options
        }, 'v2');
        if (resp.status !== 'OK') {
            throw Error('Unsuccessful status returned from api, unable to proceed');
        }
        if (resp.tickers.length <= 0) {
            throw Error('No ticker symbols returned, most likely a page number issue');
        }
        return resp;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

export interface RawTickerPageResponse {
    page: number,
    perPage: number,
    count: number,
    status: string,
    tickers: TickerSymbolResponse[]
};

export interface TickerSymbolResponse {
    ticker: string,
    name: string,
    market: string,
    locale: string,
    currency: string,
    active: boolean,
    primaryExch: string,
    type: string,
    codes: {
        [key: string]: string
    },
    updated: string,
    url: string
};
