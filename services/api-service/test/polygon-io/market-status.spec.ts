import { describe } from 'mocha';
import { assert, expect } from 'chai';
import * as PolygonBase from '../../lib/polygon-io/base-request.service';
import * as MarketStatus from '../../lib/polygon-io/market-status.service';
import Sinon from 'sinon';
import { getMarketStatus } from '../../mocks/polygon-io/market-status.mock';

describe('PolygonIO::', function () {
  let sandbox: Sinon.SinonSandbox;
  let stubs: any = {};

  beforeEach(() => {
    sandbox = Sinon.createSandbox();
    const response = getMarketStatus();
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
      const resp = await MarketStatus.getMarketStatus();
      assert(resp);
      assert(resp.exchanges);
      assert(resp.serverTime);
      expect(stubs.gotGetStub.callCount).to.equal(1);
    });
    it('Should execute unhappy path, error returned', async () => {
      stubs.gotGetStub.rejects(Error('Error'));
      try {
        const resp = await MarketStatus.getMarketStatus();
        assert(!resp);
      } catch (err) {
        assert(err);
        assert.equal(err.message, 'Error');
      }
    });
  });
});
