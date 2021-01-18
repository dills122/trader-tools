import { QuouteService } from 'api-service';
import { util, Emailer } from 'trader-sdk';

export const service = async () => {
    try {
        //TODO test more
        const results = await Promise.all(util.getWatchlist().filter(async (symbol) => {
            const { week52Low, latestPrice } = await QuouteService.quote(symbol);
            console.log(week52Low, latestPrice);
            if (week52Low >= latestPrice) {
                return true;
            }
            const percentDifference = (Math.abs(week52Low - latestPrice) / ((latestPrice + week52Low) / 2)) * 100;
            return percentDifference <= 10;
        }));
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
//TODO remove after testing
export default service;

(async () => {
    await service();
})();