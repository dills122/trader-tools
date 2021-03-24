import { polygonIOApiRequest } from './base-request.service';
import { Logger } from 'trader-sdk';

const log = new Logger.default({
    isPretty: true,
    name: 'Polygon-IO Market Status'
});

export const getMarketStatus = async () => {
    try {
        const resp = await polygonIOApiRequest<MarketStatusResponse>('/marketstatus/now', {}, 'v1');
        return resp;
    } catch (err) {
        log.error(err);
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
