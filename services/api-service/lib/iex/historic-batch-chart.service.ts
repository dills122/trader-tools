import { HistoricPriceCollection } from './historic-prices.service';
import IEXCloud from './iexcloud.service';

export interface HistoricPricesArgs {
    symbols: string[],
    timeframe: Timeframe
}

export interface HistoricBatchPricesCollection {
    [key: string]: {
        news?:[],
        quote?: [],
        chart: HistoricPriceCollection
    }
}

export type Timeframe = '1m' | '3m' | '6m' | '1y' | '2y' | '3y' | '1d' | '5d' | '10d';

export const historicBatch = async (args: HistoricPricesArgs): Promise<HistoricBatchPricesCollection> => {
    const url = `/stock/market/batch`;
    return await IEXCloud<HistoricBatchPricesCollection>(url, {
        symbols: args.symbols.join(',').toLocaleLowerCase(),
        types: 'chart',
        range: args.timeframe
    });
};