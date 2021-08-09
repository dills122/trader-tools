export interface BaseTokenizerArgs {
  stringToAnalyze?: string;
}

export class BaseTokenizer {
  protected stringToAnalyze: string;
  protected tokens: string[];
  constructor(args?: BaseTokenizerArgs) {
    if (!args) {
      return;
    }
    if (args.stringToAnalyze) {
      this.setStringToAnalyze(args.stringToAnalyze);
    }
  }

  getTokens(): string[] {
    if (!this.tokens) {
      throw Error('No tokens found to return');
    }
    return this.tokens;
  }

  protected setStringToAnalyze(stringToAnalyze: string): void {
    this.stringToAnalyze = stringToAnalyze;
  }

  protected setTokenValues(tokens: string[]): void {
    this.tokens = tokens;
  }
}
