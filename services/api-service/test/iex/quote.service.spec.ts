import { describe } from 'mocha';
import { assert, expect } from 'chai';
import IEXCloud, { tokenPlugin } from '../../lib/iex/iexcloud.service';
import * as QuoteService from '../../lib/iex/quote.service';
import Sinon from 'sinon';
import { HappyPathMock } from '../../mocks/quote.mock';

const STOCK_SYMBOL = 'AAPL';

describe('QuoteService::', function () {
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
        const resp: any = await QuoteService.quote(STOCK_SYMBOL);
        assert(resp);
        expect(resp).to.be.a('object');
        expect(resp.symbol).to.be.a('string').and.equal(STOCK_SYMBOL);
        expect(resp.high).to.be.a('number').and.equal(0);
    });

    it('Should run happy path, typed', async () => {
        const resp = await IEXCloud<QuoteService.IEXQuote>(STOCK_SYMBOL);
        assert(resp);
        expect(resp).to.be.a('object');
        expect(resp.symbol).to.be.a('string').and.equal(STOCK_SYMBOL);
        expect(resp.high).to.be.a('number').and.equal(0);
    });

    it('Should run unhappy path', async () => {
        stubs.gotGetStub.rejects(Error('err'));
        try {
            const resp = await IEXCloud<QuoteService.IEXQuote>(STOCK_SYMBOL);
            assert(!resp);
        } catch (err) {
            assert(err);
            assert(err.message);
            expect(err.message).to.equal('err');
        }
    });
});