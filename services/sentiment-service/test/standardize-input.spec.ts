import { describe } from 'mocha';
import { expect } from 'chai';
import { standardizeInput } from '../lib/standardize-input';

describe('StandardizeInput::', function () {
  describe('standardizeInput::', () => {
    it('Should filter input', () => {
      const input = 'This $ABR is a great stock';
      const standardizedInput = standardizeInput(input);
      expect(standardizedInput).to.have.length(2);
      expect(standardizedInput).to.contain('great');
      expect(standardizedInput).to.contain('stock');
    });

    it('Should filter input', () => {
      const input = 'This $F is a bad stock';
      const standardizedInput = standardizeInput(input);
      expect(standardizedInput).to.have.length(2);
      expect(standardizedInput).to.contain('bad');
      expect(standardizedInput).to.contain('stock');
    });

    it('Should filter input', () => {
      const input = "This stock isn't that great";
      const standardizedInput = standardizeInput(input);
      expect(standardizedInput).to.have.length(3);
      expect(standardizedInput).to.contain('great');
      expect(standardizedInput).to.contain('stock');
    });
  });
});
