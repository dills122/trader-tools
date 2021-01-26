import { HistoricPrices } from 'api-service';
import FastSlowSMACrossOver from 'trader-sdk/lib/strategies/fast-slow-crossover-sma';
import { getWatchlist, sliceArrayByFullChunks } from 'trader-sdk/lib/util';

export const service = async () => {
    const results: any[] = [];
    getWatchlist().forEach(async (stock) => {
        const stockCandleCollection = await HistoricPrices.historic({
            symbol: stock,
            timeframe: '2y'
        });
        const Indicator = new FastSlowSMACrossOver({
            candles: sliceArrayByFullChunks(stockCandleCollection, 200, true)
        });
        results.push({
            hasRecentCrossUp: Indicator.hasRecentCrossUp(),
            hasRecentCrossDown: Indicator.hasRecentCrossDown(),
            hasCrossDown: Indicator.hasCrossDown(),
            hasCrossUp: Indicator.hasCrossUp()
        });
    });

    //Need to add templating to be able to create a way to send this
};