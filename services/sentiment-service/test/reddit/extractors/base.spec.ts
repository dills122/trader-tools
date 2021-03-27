import { expect } from 'chai';
import { RedditExtractor } from '../../../lib/reddit/extractors/';
import { getRandomStatement } from '../../../mocks/sentiment-indicators.mock';

describe('Reddit::', function () {
  describe('Extractors::', () => {
    it('Should run happy path', () => {
      const Extractor = new RedditExtractor({
        inputString: getRandomStatement('filler', 'F')
      });
      const tickers = Extractor.extract();
      expect(tickers).to.have.length(0);
    });
    it('Should run happy path', () => {
      const extractor = new RedditExtractor({
        inputString: `I'm really like the way $F is performing recently`
      });
      const tickers = extractor.extract();
      expect(tickers).to.have.length(1);
      expect(tickers[0]).to.equal('F');
    });
  });
});
