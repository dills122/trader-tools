import { BollingerBands, Emailer, util } from 'trader-sdk';
import { HistoricPrices } from 'api-service';
import _ from 'lodash';


export const service = async () => {
    try {
        let results: any = [];
        for (const symbol of util.getWatchlist()) {
            const historicPrices = await HistoricPrices.historic({
                symbol,
                timeframe: '10d'
            });
            const closedPrices = _.map(historicPrices, 'close');
            const trend = BollingerBands.BBCrossover.CrossOver({
                dataPoints: closedPrices,
                peroid: 10,
                stdDev: 2
            });
            if (trend) {
                results.push({
                    trend,
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