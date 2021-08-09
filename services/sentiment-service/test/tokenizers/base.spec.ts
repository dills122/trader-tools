import { expect, assert } from 'chai';
import Sinon from 'sinon';
import { BaseTokenizer } from '../../lib/tokenizers/base';

describe('Tokenizers::', function () {
  let sandbox: Sinon.SinonSandbox;
  const spies: any = {};
  beforeEach(() => {
    sandbox = Sinon.createSandbox();
    spies.setStringToAnalyzeSpy = sandbox.spy(BaseTokenizer.prototype, <any>'setStringToAnalyze');
  });
  afterEach(() => {
    sandbox.restore();
  });
  describe('Base::', () => {
    it('should be able to create a new base object', () => {
      const obj = new BaseTokenizer();
      assert(obj);
      expect(obj).to.be.an('object');
      expect(spies.setStringToAnalyzeSpy.callCount).to.equal(0);
    });
    it('should throw when trying to get tokens since none are set', () => {
      const obj = new BaseTokenizer();
      assert(obj);
      expect(obj).to.be.an('object');
      expect(spies.setStringToAnalyzeSpy.callCount).to.equal(0);
      const thrws = () => obj.getTokens();
      assert.throws(thrws);
    });
    it('should be able to create a new base object with a string to analyze', () => {
      const obj = new BaseTokenizer({
        stringToAnalyze: 'test string'
      });
      assert(obj);
      expect(obj).to.be.an('object');
      expect(spies.setStringToAnalyzeSpy.callCount).to.equal(1);
    });
  });
});
