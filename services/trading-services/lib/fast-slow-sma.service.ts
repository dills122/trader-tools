import { HistoricPrices } from 'api-service';
import { Emailer, Strategies } from 'trader-sdk';
import { getWatchlist, sliceArrayByFullChunks } from 'trader-sdk/lib/util';
import { mjml } from 'templating-service';

export const service = async () => {
    const results: any[] = [];
    try {
        const stocks = getWatchlist();
        for (const stock of stocks) {
            console.log(stock);
            const stockCandleCollection = await HistoricPrices.historic({
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
            body: renderedEmailTemplate,
            subject: 'Fast Slow SMA Daily Report',
            email: 'insidertradingtips1220@gmail.com'
        });
    } catch (err) {
        console.log(err);
        throw Error('Error creating Fast/Slow SMA report');
    }
};