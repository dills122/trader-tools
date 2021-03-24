import { IEX } from 'api-service';
import { Emailer, Strategies, Logger } from 'trader-sdk';
import { getWatchlist, sliceArrayByFullChunks } from 'trader-sdk/lib/util';
import { mjml } from 'templating-service';

const log = new Logger.default({
    isPretty: true,
    name: 'Fast Slow SMA Report'
});

export const service = async () => {
    const results: any[] = [];
    try {
        const stocks = getWatchlist();
        for (const stock of stocks) {
            const stockCandleCollection = await IEX.HistoricPrices.historic({
                symbol: stock,
                timeframe: '2y'
            });
            const Indicator = new Strategies.FastSlowSMACrossOver({
                candles: sliceArrayByFullChunks(stockCandleCollection, 200, true)
            });
            results.push({
                hasRecentCrossUp: Indicator.hasRecentCrossUp(),
                hasRecentCrossDown: Indicator.hasRecentCrossDown(),
                hasCrossDown: Indicator.hasCrossDown(),
                hasCrossUp: Indicator.hasCrossUp()
            });
        };
        const renderedEmailTemplate = await mjml.createTemplateFromFile('fast-slow-sma.template.mjml', {
            trends: results
        });
        await Emailer.sendEmail({
            html: renderedEmailTemplate,
            subject: 'Fast Slow SMA Daily Report',
            email: 'insidertradingtips1220@gmail.com'
        });
    } catch (err) {
        log.error(err);
        throw Error('Error creating Fast/Slow SMA report');
    }
};
