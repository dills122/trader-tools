import { assert, expect } from 'chai';
import { EquityFilter } from '../../../lib/reddit/filters/equity-filter';
import { WordTokenizer } from 'natural';
import Sinon from 'sinon';

describe('Reddit::', () => {
  describe('Filters::', () => {
    describe('EquityFilter::', function () {
      this.timeout(5000);
      let sandbox: Sinon.SinonSandbox;
      const stubs: any = {};
      beforeEach(() => {
        sandbox = Sinon.createSandbox();
      });
      afterEach(() => {
        sandbox.restore();
      });
      it('Should find a stock ticker symbol, F', () => {
        const ticker = 'F';
        const filter = new EquityFilter({
          stringToAnalyze: `This stock, ${ticker} is really great`
        });
        const result = filter.filter();
        assert(result);
        expect(result).to.be.a('string').and.length.greaterThan(0);
        expect(result).to.equal(ticker);
      });
      it('Should find a stock ticker symbol, MSFT', () => {
        const ticker = 'MSFT';
        const filter = new EquityFilter({
          stringToAnalyze: `Cant believe ${ticker} is crusing this good`
        });
        const result = filter.filter();
        assert(result);
        expect(result).to.be.a('string').and.length.greaterThan(0);
        expect(result).to.equal(ticker);
      });
      it('Should find a stock ticker symbol, F', () => {
        const ticker = 'F';
        const filter = new EquityFilter({
          stringToAnalyze: `This stock, $${ticker} is really bad, should NOT buy`
        });
        const result = filter.filter();
        assert(result);
        expect(result).to.be.a('string').and.length.greaterThan(0);
        expect(result).to.equal(ticker);
      });
      it('Should find a stock ticker symbol, FB', () => {
        const ticker = 'FB';
        const filter = new EquityFilter({
          stringToAnalyze: `Cant believe $${ticker} is crusing this good`
        });
        const result = filter.filter();
        assert(result);
        expect(result).to.be.a('string').and.length.greaterThan(0);
        expect(result).to.equal(ticker);
      });
      it('Should NOT find a stock ticker symbol', () => {
        const filter = new EquityFilter({
          stringToAnalyze: `Cant believe stocks are crusing this good`
        });
        const result = filter.filter();
        expect(result).to.be.a('string').and.length(0);
      });
      it('Should NOT find a stock ticker symbol', () => {
        const filter = new EquityFilter({
          stringToAnalyze: `Holy moly the market it crazyy`
        });
        const result = filter.filter();
        expect(result).to.be.a('string').and.length(0);
      });
      it('Should NOT find a stock ticker symbol', () => {
        const filter = new EquityFilter({
          stringToAnalyze: `Cant believe $stocks are crusing this good`
        });
        const result = filter.filter();
        expect(result).to.be.a('string').and.length(0);
      });
      it('Should NOT error out if standardize input returns nothing', () => {
        stubs.tokenizerStub = sandbox.stub(WordTokenizer.prototype, 'tokenize').returns([]);
        const filter = new EquityFilter({
          stringToAnalyze: `Cant believe $stocks are crusing this good`
        });
        expect(stubs.tokenizerStub.callCount).to.equal(1);
        const result = filter.filter();
        expect(result).to.be.equal('');
      });

      describe('Blacklist::', () => {
        it('Should support custom blacklists', () => {
          let filter = new EquityFilter({
            stringToAnalyze: `Cant believe $stock are crusing this good. lmao I'm just joking of course.`,
            blacklist: ['dog', 'cat']
          });
          const result = filter.filter();
          expect(result).to.be.a('string').and.equal('LMAO');
          filter = new EquityFilter({
            stringToAnalyze: `Cant believe $stock are crusing this good. lmao I'm just joking of course.`,
            blacklist: ['lmao']
          });
          const resultWithUpdatedBlacklist = filter.filter();
          expect(resultWithUpdatedBlacklist).to.be.a('string').and.length(0);
        });
        it('Custom blacklist should trump config one', () => {
          const stringToAnalyze = `I need you to get me those important documents to me by eod. is that possible?`;
          let filter = new EquityFilter({
            stringToAnalyze,
            auditMode: true
          });
          const result = filter.filter();
          expect(result).to.be.a('string').and.not.equal('EOD');
          filter = new EquityFilter({
            stringToAnalyze,
            blacklist: ['lmao']
          });
          const resultWithUpdatedBlacklist = filter.filter();
          expect(resultWithUpdatedBlacklist).to.be.a('string').and.equal('EOD');
        });
      });
      describe('Whitelist::', () => {
        it('Should only get tickers from the whitelist', () => {
          const ticker = 'F';
          const filter = new EquityFilter({
            stringToAnalyze: `This stock, $${ticker} is really bad, should NOT buy`,
            equityWhitelist: ['MSFT']
          });
          const result = filter.filter();
          expect(result).to.not.equal(ticker);
          expect(result).to.be.a('string').and.length(0);
        });
        it('Should only get tickers from the whitelist', () => {
          const nonMatchTicker = 'F';
          const matchTicker = 'MSFT';
          const filter = new EquityFilter({
            stringToAnalyze: `This stock, $${nonMatchTicker} is really bad, should NOT buy. However, ${matchTicker} is really looking good and I'm gonna buy.`,
            equityWhitelist: ['MSFT']
          });
          const result = filter.filter();
          expect(result).to.not.equal(nonMatchTicker);
          expect(result).to.be.a('string').and.length.greaterThan(0);
          expect(result).to.equal(matchTicker);
        });
      });
    });
  });
});
