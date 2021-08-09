import { expect, assert } from 'chai';
import Sinon from 'sinon';
import { WordPunctTokenizer as tokenizer } from 'natural';
import { WordTokenizer } from '../../lib/tokenizers/wordTokenizer';

const Two_Sentences = 'This is a sentence. Another sentence is right here too.';
const One_Sentence = 'This is a sentence.';

describe('Tokenizers::', function () {
  let sandbox: Sinon.SinonSandbox;
  const spies: any = {};
  beforeEach(() => {
    sandbox = Sinon.createSandbox();
    spies.setStringToAnalyzeSpy = sandbox.spy(WordTokenizer.prototype, <any>'setStringToAnalyze');
    spies.setTokenValuesSpy = sandbox.spy(WordTokenizer.prototype, <any>'setTokenValues');
    spies.getTokensSpy = sandbox.spy(WordTokenizer.prototype, <any>'getTokens');
    spies.tokenizerSpy = sandbox.spy(tokenizer.prototype, 'tokenize');
  });
  afterEach(() => {
    sandbox.restore();
  });
  describe('Sentence::', () => {
    it('Should be able to run tokenizer, multi sentence', () => {
      const tokenizerObj = new WordTokenizer();
      const tokenizedInput = tokenizerObj.tokenize(Two_Sentences);
      assert(tokenizedInput);
      expect(tokenizedInput).to.have.length(12);
      expect(spies.setStringToAnalyzeSpy.callCount).to.equal(1);
      expect(spies.setTokenValuesSpy.callCount).to.equal(1);
      expect(spies.getTokensSpy.callCount).to.equal(1);
      expect(spies.tokenizerSpy.callCount).to.equal(1);
    });
    it('Should be able to run tokenizer, single sentence', () => {
      const tokenizerObj = new WordTokenizer();
      const tokenizedInput = tokenizerObj.tokenize(One_Sentence);
      assert(tokenizedInput);
      expect(tokenizedInput).to.have.length(5);
      expect(spies.setStringToAnalyzeSpy.callCount).to.equal(1);
      expect(spies.setTokenValuesSpy.callCount).to.equal(1);
      expect(spies.getTokensSpy.callCount).to.equal(1);
      expect(spies.tokenizerSpy.callCount).to.equal(1);
    });
  });
});
