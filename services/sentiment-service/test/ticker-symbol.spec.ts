import { describe } from 'mocha';
import { expect } from 'chai';
import { cleanUpTickerSymbol, containsFilter } from '../lib/ticker-symbols';

describe('TicketSymbol::', function () {
  describe('cleanUpTickerSymbol::', () => {
    it('should return a clean symbol', () => {
      const cleanedText = cleanUpTickerSymbol('$abr');
      expect(cleanedText).to.equal('ABR');
    });
    it('should return a clean symbol', () => {
      const cleanedText = cleanUpTickerSymbol('$F');
      expect(cleanedText).to.equal('F');
    });
    it('should return a clean symbol', () => {
      const cleanedText = cleanUpTickerSymbol('$abrD');
      expect(cleanedText).to.equal('ABRD');
    });
    it('should return a clean symbol', () => {
      const cleanedText = cleanUpTickerSymbol('MSNVF');
      expect(cleanedText).to.equal('MSNVF');
    });
    it('should return an empty string given an empty string', () => {
      const cleanedText = cleanUpTickerSymbol('');
      expect(cleanedText).to.equal('');
    });
  });

  describe('containsFilter::', () => {
    it('should find a string with a filter', () => {
      const hasFilter = containsFilter('$F', '$');
      expect(hasFilter).to.be.true;
    });
    it('should find a string with a filter', () => {
      const hasFilter = containsFilter('<F', '<');
      expect(hasFilter).to.be.true;
    });
    it('should NOT find a string with a filter', () => {
      const hasFilter = containsFilter('F', '$');
      expect(hasFilter).to.be.false;
    });
    it('should NOT find a string with a filter', () => {
      const hasFilter = containsFilter('F', '<');
      expect(hasFilter).to.be.false;
    });
  });
});
