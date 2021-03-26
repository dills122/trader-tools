import { assert, expect } from 'chai';
import { EquityFilter } from '../../../lib/reddit/filters/equity-filter';

describe('Reddit::', () => {
  describe('Filters::', () => {
    describe.only('EquityFilter::', () => {
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
      // it('Should NOT find a stock ticker symbol', () => {
      //     const filter = new EquityFilter({
      //         stringToAnalyze: `Cant believe stocks are crusing this good`
      //     });
      //     const result = filter.filter();
      //     assert(result);
      //     expect(result).to.be.a('string').and.length(0);
      // });
      // it('Should NOT find a stock ticker symbol', () => {
      //     const filter = new EquityFilter({
      //         stringToAnalyze: `Holy moly the market it crazyy`
      //     });
      //     const result = filter.filter();
      //     assert(result);
      //     expect(result).to.be.a('string').and.length(0);
      // });
    });
  });
});
