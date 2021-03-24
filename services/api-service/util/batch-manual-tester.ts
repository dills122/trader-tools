import { historicBatch } from '../lib/iex/historic-batch-chart.service';

(async () => {
    const batchResults = await historicBatch({
        symbols: ['AAPL', 'F', 'MSFT'],
        timeframe: '1m'
    });
    console.log(JSON.stringify(batchResults, null, 3));
})();