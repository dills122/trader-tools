import { IEX } from 'api-service';
import { Emailer, Strategies } from 'trader-sdk';
import { getWatchlist, sliceArrayByFullChunks } from 'trader-sdk/lib/util';
import { mjml } from 'templating-service';

//TODO this service seems to be working, but template is not showing SYMBOLS
export const service = async (): Promise<void> => {
  const results: Record<string, unknown>[] = [];
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
        symbol: stock,
        hasRecentCrossUp: Indicator.hasRecentCrossUp(),
        hasRecentCrossDown: Indicator.hasRecentCrossDown(),
        hasCrossDown: Indicator.hasCrossDown(),
        hasCrossUp: Indicator.hasCrossUp()
      });
    }
    const renderedEmailTemplate = await mjml.createTemplateFromFile('fast-slow-sma.template.mjml', {
      trends: results
    });
    await Emailer.sendEmail({
      html: renderedEmailTemplate,
      subject: 'Fast Slow SMA Daily Report',
      email: 'insidertradingtips1220@gmail.com'
    });
  } catch (err) {
    console.error(err);
    throw Error('Error creating Fast/Slow SMA report');
  }
};
