import { polygonIOApiRequest } from './base-request.service';

export const getMarketStatus = async () => {
    try {
        const resp = await polygonIOApiRequest<MarketStatusResponse>('/marketstatus/now', {}, 'v1');
        return resp;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

export interface MarketStatusResponse {
    market: string,
    serverTime: string,
    exchanges: {
        [key: string]: string
    },
    currencies: {
        [key: string]: string
    }
};
