import { describe } from 'mocha';
import { assert, expect } from 'chai';
import { tokenPlugin } from '../lib/iexcloud.service';
import * as HistoricBatchPrices from '../lib/historic-batch-chart.service';
import Sinon from 'sinon';
import { HappyPathMock } from '../mocks/historical-batch.mock';

const STOCK_SYMBOL = 'AAPL';

describe('HistoricalBatchChart::', function () {
    let sandbox: Sinon.SinonSandbox;
    let stubs: any = {};

    beforeEach(() => {
        sandbox = Sinon.createSandbox();
        stubs.gotGetStub = sandbox.stub(tokenPlugin, 'get').resolves({
            body: JSON.stringify(HappyPathMock)
        });
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('Should run happy path', async () => {
        const resp: any = await HistoricBatchPrices.historicBatch({
            symbols: [STOCK_SYMBOL],
            timeframe: '1d'
        });
        assert(resp);
        const stockBatchData = resp[STOCK_SYMBOL];
        expect(stockBatchData).to.be.a('object');
        const stockBatchChartData = stockBatchData.chart;
        expect(stockBatchChartData).to.be.a('array');
        const quote = stockBatchChartData[0];
        expect(quote.symbol).to.be.a('string').and.equal(STOCK_SYMBOL);
        expect(quote.high).to.be.a('number').and.equal(0);
    });

    it('Should run unhappy path', async () => {
        stubs.gotGetStub.rejects(Error('err'));
        try {
            const resp: any = await HistoricBatchPrices.historicBatch({
                symbols: [STOCK_SYMBOL],
                timeframe: '1d'
            });
            assert(!resp);
        } catch (err) {
            assert(err);
            assert(err.message);
            expect(err.message).to.equal('err');
        }
    });
});