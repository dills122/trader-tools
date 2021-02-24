import { SocialSentiment } from 'api-service';
import { Emailer, util } from 'trader-sdk';
import _ from 'lodash';
import { mjml } from 'templating-service';

const SocialSentimentIO = SocialSentiment.SocialSentimentIO;

export const service = async () => {
    try {
        let aggregatedResults: SocialSentiment.SocialSentimentIO.StockSentimentResult[] = [];
        const pageOne = await SocialSentimentIO.dailyStockSentiment(1);
        const maxNumberOfPages = _.round(pageOne.count / 50, 0);
        const randomPageNumberList = _.slice(util.shuffleArray(_.range(2, maxNumberOfPages)), 0, SocialSentimentIO.rateLimit() - 1);
        
        aggregatedResults = aggregatedResults.concat(pageOne.results);
        
        for (let page of randomPageNumberList) {
            const pageResults = await SocialSentimentIO.dailyStockSentiment(page);
            aggregatedResults = aggregatedResults.concat(pageResults.results);
        }

        const watchlist = util.getWatchlist();
        const watchlistStocksSentimentResults = _.filter(aggregatedResults, (stockSentimentResult) => {
            return watchlist.includes(stockSentimentResult.stock.toUpperCase());
        });
        const renderedTemplate = await mjml.createTemplateFromFile('watchlist-daily-sentiment.template.mjml', {
            stockLinks: watchlistStocksSentimentResults
        });
        await Emailer.sendEmail({
            html: renderedTemplate,
            subject: 'Social Sentiment Report',
            email: 'insidertradingtips1220@gmail.com'
        });
        //TODO create a way to go through the aggregated data and look for watchlist stocks and good/bad trending stocks
    } catch (err) {
        console.log(err);
        throw Error('Error Generating Sentiment Report');
    }
};