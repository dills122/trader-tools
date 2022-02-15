import { describe } from 'mocha';
import { assert, expect } from 'chai';
import * as PolygonBase from '../../lib/polygon-io/base-request.service';
import * as HistoricQuote from '../../lib/polygon-io/historic-quote.service';
import Sinon from 'sinon';
import { getHistoricQuote } from '../../mocks/polygon-io/historic-quote.mock';

describe('PolygonIO::', function () {
  let sandbox: Sinon.SinonSandbox;
  const stubs: any = {};

  beforeEach(() => {
    sandbox = Sinon.createSandbox();
    const response = getHistoricQuote('F');
    stubs.gotGetStub = sandbox.stub(PolygonBase.tokenPlugin, 'get').resolves({
      body: JSON.stringify(response)
    });
    stubs.consoleErrorStub = sandbox.stub(console, 'error').returns();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('Historic Quote::', () => {
    it('Should execute happy path', async () => {
      const resp = await HistoricQuote.getHistoricQuote('F');
      assert(resp);
      assert(resp.symbol);
      expect(resp.low).to.equal(0);
      expect(resp.high).to.equal(0);
      expect(resp.close).to.equal(0);
      expect(resp.open).to.equal(0);
      expect(resp.volume).to.equal(0);
      expect(stubs.gotGetStub.callCount).to.equal(1);
    });
    it('Should execute unhappy path, error returned', async () => {
      stubs.gotGetStub.rejects(Error('Error'));
      try {
        const resp = await HistoricQuote.getHistoricQuote('F');
        assert(!resp);
      } catch (err) {
        assert(err);
        assert.equal((err as Error).message, 'Error');
      }
    });
  });
});
