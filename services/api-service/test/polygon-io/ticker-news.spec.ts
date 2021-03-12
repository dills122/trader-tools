import { describe } from 'mocha';
import { assert, expect } from 'chai';
import * as PolygonBase from '../../lib/polygon-io/base-request.service';
import * as TickerNews from '../../lib/polygon-io/ticker-news.service';
import Sinon from 'sinon';
import { getTickerNewsItemList } from '../../mocks/polygon-io/ticker-news.mock';

describe('PolygonIO::', function () {
    let sandbox: Sinon.SinonSandbox;
    let stubs: any = {};

    beforeEach(() => {
        sandbox = Sinon.createSandbox();
        const response = getTickerNewsItemList(['F'], 2);
        stubs.gotGetStub = sandbox.stub(PolygonBase.tokenPlugin, 'get').resolves({
            body: JSON.stringify(response)
        });
        stubs.consoleErrorStub = sandbox.stub(console, 'error').returns();
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('Ticker News::', () => {
        it("Should execute happy path", async () => {
            const resp = await TickerNews.getTickerNewsItems('F');
            assert(resp);
            expect(resp.length).to.equal(2);
            const first = resp[0];
            assert(first);
            expect(stubs.gotGetStub.callCount).to.equal(1);
        });
        it("Should execute happy path, no results", async () => {
            const response = getTickerNewsItemList(['F'], 0);
            stubs.gotGetStub.resolves({
                body: JSON.stringify(response)
            });
            const resp = await TickerNews.getTickerNewsItems('F');
            assert(resp);
            expect(resp.length).to.equal(0);
            expect(stubs.gotGetStub.callCount).to.equal(1);
        });
        it("Should execute unhappy path, error returned", async () => {
            stubs.gotGetStub.rejects(Error('Error'));
            try {
                const resp = await TickerNews.getTickerNewsItems('F');
                assert(!resp);
            } catch (err) {
                assert(err);
                assert.equal(err.message, 'Error');
            }
        });
    });
});