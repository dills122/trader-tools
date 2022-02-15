import { describe } from 'mocha';
import { assert, expect } from 'chai';
import { tokenPlugin } from '../../lib/iex/iexcloud.service';
import * as Symbols from '../../lib/iex/symbol.service';
import Sinon from 'sinon';
import { HappyPathMock } from '../../mocks/symbols.mock';

const STOCK_SYMBOL = 'A';

describe('Symbols::', function () {
  let sandbox: Sinon.SinonSandbox;
  const stubs: any = {};

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
    const resp: any = await Symbols.symbols();
    assert(resp);
    expect(resp).to.be.a('array');
    const quote = resp[0];
    expect(quote.symbol).to.be.a('string').and.equal(STOCK_SYMBOL);
    expect(quote.name).to.be.a('string').and.equal('Agilent Technologies Inc.');
  });

  it('Should run unhappy path', async () => {
    stubs.gotGetStub.rejects(Error('err'));
    try {
      const resp: any = await Symbols.symbols();
      assert(!resp);
    } catch (err) {
      assert(err);
      assert((err as Error).message);
      expect((err as Error).message).to.equal('err');
    }
  });
});
