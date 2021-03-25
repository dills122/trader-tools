import { describe } from 'mocha';
import { assert, expect } from 'chai';
import * as SocialSentiment from '../../lib/sentiment-analysis/social-sentiment-io.service';
import Sinon from 'sinon';
import * as Mocks from '../../mocks/social-sentiment-io.mock';

const Symbols = ['F', 'ABR', 'FB'];

describe('IEXCloud::', function () {
  let sandbox: Sinon.SinonSandbox;
  let stubs: any = {};

  beforeEach(() => {
    sandbox = Sinon.createSandbox();
    stubs.gotGetStub = sandbox.stub(SocialSentiment.authPlugin, 'get').resolves({
      body: '{"value":"string"}'
    });
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('rateLimit', () => {
    it('Should get rate limit', () => {
      const rateLimitVal = SocialSentiment.rateLimit();
      expect(rateLimitVal).to.equal(25);
    });
  });

  describe('trendingStocksSentiment::', () => {
    beforeEach(() => {
      stubs.gotGetStub.resolves({
        body: JSON.stringify(Mocks.getStockSentimentResultList(Symbols))
      });
    });
    it('should execute happy path', async () => {
      const resp = await SocialSentiment.trendingStocksSentiment('reddit');
      assert(resp);
      expect(stubs.gotGetStub.callCount).to.equal(1);
      expect(resp.length).to.equal(3);
      expect(resp.every((symbol) => Symbols.includes(symbol.stock)));
    });
    it('should execute happy path', async () => {
      const resp = await SocialSentiment.trendingStocksSentiment('twitter');
      assert(resp);
      expect(stubs.gotGetStub.callCount).to.equal(1);
      expect(resp.length).to.equal(3);
      expect(resp.every((symbol) => Symbols.includes(symbol.stock)));
    });
    it('should execute error case', async () => {
      stubs.gotGetStub.rejects(Error('err'));
      try {
        await SocialSentiment.trendingStocksSentiment('twitter');
      } catch (err) {
        assert(err);
        expect(stubs.gotGetStub.callCount).to.equal(1);
        expect(err.message).to.equal('err');
      }
    });
  });
  describe('dailyStockSentiment::', () => {
    beforeEach(() => {
      stubs.gotGetStub.resolves({
        body: JSON.stringify(Mocks.getDailyStockSentimentResults(Symbols))
      });
    });
    it('should execute happy path', async () => {
      const resp = await SocialSentiment.dailyStockSentiment(1);
      assert(resp);
      expect(stubs.gotGetStub.callCount).to.equal(1);
      expect(resp.count).to.equal(resp.results.length);
      expect(resp.results.every((symbol) => Symbols.includes(symbol.stock)));
    });
    it('should execute happy path', async () => {
      const resp = await SocialSentiment.dailyStockSentiment(1);
      assert(resp);
      expect(stubs.gotGetStub.callCount).to.equal(1);
      expect(resp.count).to.equal(resp.results.length);
      expect(resp.results.every((symbol) => Symbols.includes(symbol.stock)));
    });
    it('should execute error case', async () => {
      stubs.gotGetStub.rejects(Error('err'));
      try {
        await SocialSentiment.dailyStockSentiment(1);
      } catch (err) {
        assert(err);
        expect(stubs.gotGetStub.callCount).to.equal(1);
        expect(err.message).to.equal('err');
      }
    });
  });
});
