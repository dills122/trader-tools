import { describe } from 'mocha';
import { assert, expect } from 'chai';
import { Base } from '../../lib/extractors';
import { getRandomStatement } from '../../mocks/sentiment-indicators.mock';

describe('Extractors::', function () {
  describe('Base::', () => {
    it('Should run happy path and find no tickers', () => {
      const extractor = new Base.Extractor({
        inputString: getRandomStatement('filler', 'F')
      });
      const tickers = extractor.extract();
      expect(tickers).to.have.length(0);
    });
    it('Should run happy path and find no tickers', () => {
      const extractor = new Base.Extractor({});
      const tickers = extractor.extract(getRandomStatement('filler', 'F'));
      expect(tickers).to.have.length(0);
    });
    it('Should run happy path and find ticker F', () => {
      const extractor = new Base.Extractor({});
      const tickers = extractor.extract(getRandomStatement('positive', 'F'));
      expect(tickers).to.have.length(1);
      expect(tickers[0]).to.equal('F');
    });
    it('Should run happy path and find ticker F', () => {
      const extractor = new Base.Extractor({
        inputString: getRandomStatement('positive', 'F')
      });
      const tickers = extractor.extract();
      expect(tickers).to.have.length(1);
      expect(tickers[0]).to.equal('F');
    });

    it('Should error out if no input string is given', () => {
      const extractor = new Base.Extractor({});
      const thrws = () => extractor.extract();
      assert.throws(thrws);
    });
    describe('FilterPatterns::', () => {
      it('Should run happy path, with filter patterns and find ticker F', () => {
        const extractor = new Base.Extractor({
          inputString: `I'm really like the way $F is performing recently`,
          filterPattern: ['$']
        });
        const tickers = extractor.extract();
        expect(tickers).to.have.length(1);
        expect(tickers[0]).to.equal('F');
      });
      it('Should run happy path, with filter patterns and find ticker ABR', () => {
        const extractor = new Base.Extractor({
          inputString: `$ABR is really performing great recently`,
          filterPattern: ['$']
        });
        const tickers = extractor.extract();
        expect(tickers).to.have.length(1);
        expect(tickers[0]).to.equal('ABR');
      });
    });
    describe('Whitelist::', () => {
      it('Should run happy path, with whitelist and find ticker F', () => {
        const extractor = new Base.Extractor({
          inputString: `I'm really like the way $F is performing recently`,
          whitelist: ['F', 'ABR']
        });
        const tickers = extractor.extract();
        expect(tickers).to.have.length(1);
        expect(tickers[0]).to.equal('F');
      });
      it('Should run happy path, with filter patterns and find ticker ABR', () => {
        const extractor = new Base.Extractor({
          inputString: `$ABR is really performing great recently`,
          whitelist: ['F', 'ABR']
        });
        const tickers = extractor.extract();
        expect(tickers).to.have.length(1);
        expect(tickers[0]).to.equal('ABR');
      });
    });
  });
});
