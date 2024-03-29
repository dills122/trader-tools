import { IEX } from 'api-service';
import { util } from 'trader-sdk';
import { Emailer } from 'shared-sdk';

export const service = async (): Promise<void> => {
  try {
    const results = await util.asyncFilter(util.getWatchlist(), async (symbol) => {
      try {
        const { week52Low, latestPrice } = await IEX.Quote.quote(symbol);
        if (week52Low >= latestPrice) {
          return true;
        }
        const percentDifference = util.calculatePercentDifference(week52Low, latestPrice);
        return percentDifference <= 10;
      } catch (err) {
        console.warn(err);
        return false;
      }
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
    console.error(err);
  }
};
