import { WordPunctTokenizer as tokenizer } from 'natural';
import { BaseTokenizer, BaseTokenizerArgs } from './base';

export class WordTokenizer extends BaseTokenizer {
  private tokenizer: tokenizer;
  constructor(args?: BaseTokenizerArgs) {
    super(args);
    this.tokenizer = new tokenizer();
  }

  tokenize(stringToAnalyze: string = this.stringToAnalyze): string[] {
    if (!stringToAnalyze) {
      throw Error('No string to analyze given');
    }
    this.setStringToAnalyze(stringToAnalyze);

    const tokens = this.tokenizer.tokenize(this.stringToAnalyze);
    if (tokens.length <= 0) {
      throw Error('Tokenization resulted in no tokens');
    }
    this.setTokenValues(tokens);
    return this.getTokens();
  }
}
