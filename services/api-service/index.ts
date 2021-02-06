import IEXCloud from './lib/iexcloud.service';
import * as QuouteService from './lib/quote.service';
import * as HistoricPrices from './lib/historic-prices.service';
import * as HistoricBatchPrices from './lib/historic-batch-chart.service';

export default {
    IEXCloud,
    QuouteService,
    HistoricPrices,
    HistoricBatchPrices
};

export {
    IEXCloud,
    QuouteService,
    HistoricPrices,
    HistoricBatchPrices
};