import { WordTokenizer } from 'natural';
import { Loggers } from 'trader-sdk';
const aposToLexForm = require('apos-to-lex-form');
import SpellCorrector from 'spelling-corrector';
import StopWord from 'stopword';
import BadWords from 'bad-words';

const AuditLogger = Loggers.Audit.logger;

export interface StandardizeInputOptions {
  disableStopWords?: boolean;
  disableProfanityFilter?: boolean;
  disableSpellCheckFilter?: boolean;
}

export interface InputStandardizerArgs {
  options?: StandardizeInputOptions;
  auditMode?: boolean; //Used for testing/debugging
}

export class InputStandardizer {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private SpellCorrectorInst: any;
  private options: StandardizeInputOptions;
  private auditMode: boolean;
  constructor(args: InputStandardizerArgs = {}) {
    const SpellCorrectorInst = new SpellCorrector();
    SpellCorrectorInst.loadDictionary();
    this.SpellCorrectorInst = SpellCorrectorInst;
    if (args.options) {
      this.options = args.options;
    }
    this.auditMode = args.auditMode || false;
  }

  standardize(input: string, options: StandardizeInputOptions = this.options): string[] {
    const { disableProfanityFilter, disableStopWords, disableSpellCheckFilter } = options || {};
    const lexedInput: string = aposToLexForm(input);
    AuditLogger.log(`Lexed: ${lexedInput}`, this.auditMode);
    const loweredLexedInput = lexedInput.toLowerCase();

    const symbolStrippedInput = loweredLexedInput.replace(/[^a-zA-Z\s]+/g, '');
    AuditLogger.log(`Symbol Stripped: ${symbolStrippedInput}`, this.auditMode);

    const tokenizer = new WordTokenizer(); //TODO this needs looked into to see what the best one is to use and if I can build a strat to switch them in scenerios
    let tokenizedLexedInput: string[] = tokenizer.tokenize(symbolStrippedInput);
    AuditLogger.log(`Tokenized: ${tokenizedLexedInput}`, this.auditMode);

    if (!disableProfanityFilter) {
      const badWordFilter = new BadWords();
      tokenizedLexedInput = tokenizedLexedInput.filter((word) => {
        return !badWordFilter.isProfane(word.toUpperCase());
      });
      AuditLogger.log(`Non-Profane: ${tokenizedLexedInput}`, this.auditMode);
    }

    if (!disableSpellCheckFilter) {
      tokenizedLexedInput = tokenizedLexedInput.map((word) => {
        return this.SpellCorrectorInst.correct(word);
      });
      AuditLogger.log(`Correctly Spelled: ${tokenizedLexedInput}`, this.auditMode);
    }

    if (!disableStopWords) {
      tokenizedLexedInput = StopWord.removeStopwords(tokenizedLexedInput);
      AuditLogger.log(`Non-Stop Worded: ${tokenizedLexedInput}`, this.auditMode);
    }

    if (tokenizedLexedInput.length <= 0) {
      throw Error('No results found after standardizing input');
    }
    AuditLogger.log(`Final Product: ${tokenizedLexedInput}`, this.auditMode);
    return tokenizedLexedInput;
  }

  scrubTickerFromInput(
    inputString: string | string[],
    ticker: string,
    filterPatterns: string[] = []
  ): string[] {
    ticker = ticker.toLowerCase();
    if (typeof inputString === 'string') {
      inputString = this.standardize(inputString, {
        disableProfanityFilter: true,
        disableSpellCheckFilter: true,
        disableStopWords: true
      });
    }
    return inputString.filter((token) => {
      if (ticker === token) {
        return false;
      }
      const matchWithFilterPattern = filterPatterns.some((pattern) => token === `${pattern}${ticker}`);
      if (matchWithFilterPattern) {
        return false;
      }
      return true;
    });
  }
}
