import { QuouteService } from 'api-service';
import { util, Emailer } from 'trader-sdk';

export const service = async () => {
    try {
        const results = await util.asyncFilter(util.getWatchlist(), async (symbol) => {
            const { week52Low, latestPrice } = await QuouteService.quote(symbol);
            if (week52Low >= latestPrice) {
                return true;
            }
            const percentDifference = util.calculatePercentDifference(week52Low, latestPrice);
            return percentDifference <= 10;
        });
        if (results.length <= 0) {
            return;
        }
        await Emailer.sendEmail({
            body: `Stocks below or within 10% of 52 Week Low ${results.join(', ')}`,
            subject: '52 Week Low Report',
            email: 'insidertradingtips1220@gmail.com'
        });
    } catch (err) {
        console.log(err);
    }
};
