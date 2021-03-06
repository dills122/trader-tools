import { describe } from 'mocha';
import { assert, expect } from 'chai';
import { tokenPlugin } from '../lib/iexcloud.service';
import * as CryptoSymbols from '../lib/crypto-symbols.service';
import Sinon from 'sinon';
import { HappyPathMock } from '../mocks/crypto-symbols.mock';

const STOCK_SYMBOL = 'BTCUSD';

describe('CryptoSymbols::', function () {
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
        const resp: any = await CryptoSymbols.cryptoSymbols();
        assert(resp);
        expect(resp).to.be.a('array');
        const quote = resp[0];
        expect(quote.symbol).to.be.a('string').and.equal(STOCK_SYMBOL);
        expect(quote.name).to.be.a('string').and.equal("Bitcoin to USD");
    });

    it('Should run unhappy path', async () => {
        stubs.gotGetStub.rejects(Error('err'));
        try {
            const resp: any = await CryptoSymbols.cryptoSymbols();
            assert(!resp);
        } catch (err) {
            assert(err);
            assert(err.message);
            expect(err.message).to.equal('err');
        }
    });
});