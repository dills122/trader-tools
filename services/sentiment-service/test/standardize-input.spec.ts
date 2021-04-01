import { describe } from 'mocha';
import { expect } from 'chai';
import { InputStandardizer } from '../lib/standardize-input';

describe('StandardizeInput::', function () {
  describe('standardizeInput::', () => {
    it('Should standardize input', () => {
      const input = 'This $ABR is a great stock';
      const standardizer = new InputStandardizer();
      const standardizedInput = standardizer.standardize(input);
      expect(standardizedInput).to.have.length(3);
      expect(standardizedInput).to.contain('great');
      expect(standardizedInput).to.contain('stock');
    });

    it('Should standardize input and filter out ticker if any', () => {
      const input = 'This $ABR is a great stock';
      const standardizer = new InputStandardizer();
      const tokenizedWithoutTicker = standardizer.scrubTickerFromInput(input, 'ABR', ['$']);
      const standardizedInput = standardizer.standardize(tokenizedWithoutTicker.join(' '));
      expect(standardizedInput).to.have.length(2);
      expect(standardizedInput).to.contain('great');
      expect(standardizedInput).to.contain('stock');
    });

    it('Should standardize input', () => {
      const input = 'This $F is a bad stock';
      const standardizer = new InputStandardizer();
      const standardizedInput = standardizer.standardize(input);
      expect(standardizedInput).to.have.length(3);
      expect(standardizedInput).to.contain('bad');
      expect(standardizedInput).to.contain('stock');
    });

    it('Should standardize input and filter out ticker if any', () => {
      const input = 'This $F is a bad stock';
      const standardizer = new InputStandardizer();
      const tokenizedWithoutTicker = standardizer.scrubTickerFromInput(input, 'F', ['$']);
      const standardizedInput = standardizer.standardize(tokenizedWithoutTicker.join(' '));
      expect(standardizedInput).to.have.length(2);
      expect(standardizedInput).to.contain('bad');
      expect(standardizedInput).to.contain('stock');
    });

    it('Should standardize input and filter out ticker if any', () => {
      const input = 'This F is a bad stock';
      const standardizer = new InputStandardizer();
      const tokenizedWithoutTicker = standardizer.scrubTickerFromInput(input, 'F');
      const standardizedInput = standardizer.standardize(tokenizedWithoutTicker.join(' '));
      expect(standardizedInput).to.have.length(2);
      expect(standardizedInput).to.contain('bad');
      expect(standardizedInput).to.contain('stock');
    });

    it('Should standardize input', () => {
      const input = "This stock isn't that great";
      const standardizer = new InputStandardizer();
      const standardizedInput = standardizer.standardize(input);
      expect(standardizedInput).to.have.length(3);
      expect(standardizedInput).to.contain('great');
      expect(standardizedInput).to.contain('stock');
    });
  });
});
