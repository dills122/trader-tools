import { BollingerBands, Emailer, util } from 'trader-sdk';
import { HistoricPrices } from 'api-service';
import _ from 'lodash';

const { CrossOver } = BollingerBands;


export const service = async () => {
    try {
        let results: any = [];
        for (const symbol of util.getWatchlist()) {
            const historicPrices = await HistoricPrices.historic({
                symbol,
                timeframe: '10d'
            });
            const closedPrices = _.map(historicPrices, 'close');
            const crossOver = new CrossOver({
                periodData: closedPrices,
                period: 10,
                stdDev: 2
            })
            const isCrossingDown = crossOver.isCrossingDown();
            const isCrossingUp = crossOver.isCrossingUp();
            if (isCrossingUp || isCrossingDown) {
                results.push({
                    trend: isCrossingUp ? 'upwards' : 'downwards',
                    symbol
                });
            }
        }
        if (results.length <= 0) {
            return;
        }
        await Emailer.sendEmail({
            body: `Bollinger Bands Short Term Trend Report: ${results.join(', ')}`,
            subject: 'Short BB Trend Report',
            email: 'insidertradingtips1220@gmail.com'
        });
    } catch (err) {
        console.log(err);
    }
};