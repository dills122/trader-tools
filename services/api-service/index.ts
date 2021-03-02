import IEXCloud from './lib/iexcloud.service';
import * as QuouteService from './lib/quote.service';
import * as HistoricPrices from './lib/historic-prices.service';
import * as HistoricBatchPrices from './lib/historic-batch-chart.service';
import * as SocialSentiment from './lib/sentiment-analysis';
import * as Socials from './lib/social';

import * as Mocks from './mocks';

export default {
    IEXCloud,
    QuouteService,
    HistoricPrices,
    HistoricBatchPrices,
    SocialSentiment,
    Socials,
    Mocks
};

export {
    IEXCloud,
    QuouteService,
    HistoricPrices,
    HistoricBatchPrices,
    SocialSentiment,
    Socials,
    Mocks
};