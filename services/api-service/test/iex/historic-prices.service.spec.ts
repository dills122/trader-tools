import { describe } from 'mocha';
import { assert, expect } from 'chai';
import { tokenPlugin } from '../../lib/iex/iexcloud.service';
import * as HistoricPrices from '../../lib/iex/historic-prices.service';
import Sinon from 'sinon';
import { HappyPathMock } from '../../mocks/historic-prices.mock';

const STOCK_SYMBOL = 'AAPL';

describe('HistoricPrices::', function () {
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
        const resp: any = await HistoricPrices.historic({
            symbol: STOCK_SYMBOL,
            timeframe: '1d'
        });
        assert(resp);
        expect(resp).to.be.a('array');
        const quote = resp[0];
        expect(quote.symbol).to.be.a('string').and.equal(STOCK_SYMBOL);
        expect(quote.high).to.be.a('number').and.equal(0);
    });

    it('Should run unhappy path', async () => {
        stubs.gotGetStub.rejects(Error('err'));
        try {
            const resp: any = await HistoricPrices.historic({
                symbol: STOCK_SYMBOL,
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