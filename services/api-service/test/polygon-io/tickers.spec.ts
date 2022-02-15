import { describe } from 'mocha';
import { assert, expect } from 'chai';
import * as PolygonBase from '../../lib/polygon-io/base-request.service';
import * as Ticker from '../../lib/polygon-io/tickers.service';
import Sinon from 'sinon';
import { getRawTickerPageResponse } from '../../mocks/polygon-io/tickers.mock';

describe('PolygonIO::', function () {
  let sandbox: Sinon.SinonSandbox;
  const stubs: any = {};

  beforeEach(() => {
    sandbox = Sinon.createSandbox();
    const response = getRawTickerPageResponse(['ABR', 'F', 'FB', 'GE']);
    stubs.gotGetStub = sandbox.stub(PolygonBase.tokenPlugin, 'get').resolves({
      body: JSON.stringify(response)
    });
    stubs.consoleErrorStub = sandbox.stub(console, 'error').returns();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('Tickers::', () => {
    it('Should execute happy path', async () => {
      const resp = await Ticker.getTickerSymbolPage(1);
      assert(resp);
      expect(resp.tickers.length).to.equal(4);
      expect(stubs.gotGetStub.callCount).to.equal(1);
    });
    it('Should execute unhappy path, non OK status', async () => {
      const response = getRawTickerPageResponse(['ABR', 'F', 'FB', 'GE']);
      response.status = 'BAD';
      stubs.gotGetStub.resolves({
        body: JSON.stringify(response)
      });
      try {
        const resp = await Ticker.getTickerSymbolPage(1);
        assert(!resp);
      } catch (err) {
        assert(err);
        assert.equal((err as Error).message, 'Unsuccessful status returned from api, unable to proceed');
      }
    });
  });
});
