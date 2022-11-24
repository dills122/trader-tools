import { Loggers } from 'shared-sdk';
const aposToLexForm = require('apos-to-lex-form');
import SpellCorrector from 'spelling-corrector';
import StopWord from 'stopword';
import BadWords from 'bad-words';
import * as tokenizers from './tokenizers';

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

    /**
     * TODO I think you would want to keep symbols like .,;: for the sentence tokenizer to pickup
     * Would need to ensure all symbols are filtered out later on though
     */
    const symbolStrippedInput = loweredLexedInput.replace(/[^a-zA-Z\s]+/g, '');
    AuditLogger.log(`Symbol Stripped: ${symbolStrippedInput}`, this.auditMode);

    let tokenizedLexedInput: string[] = this.tokenizeInput(symbolStrippedInput);
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
    /**
     * TODO future output should be an object of:
     * dirtyInput: original input string | string
     * scrubbedInputWordTokenized: clean word tokenized output | string[]
     * scrubbedInput: clean non-tokenized output | string
     * scrubbedInputSentenceTokenized: clean sentence tokenized output | string[]
     */
    return tokenizedLexedInput;
  }

  //Future state would be to actually have a way to return it in different forms, sentences, all words, etc
  private tokenizeInput(inputString: string): string[] {
    let tokenList: string[] = [];
    const sentenceTokenizer = new tokenizers.Sentence.SentenceTokenizer({
      stringToAnalyze: inputString
    });
    const wordTokenizer = new tokenizers.Word.WordTokenizer();
    sentenceTokenizer.tokenize().forEach((sentenceToken) => {
      const wordTokens = wordTokenizer.tokenize(sentenceToken);
      tokenList = tokenList.concat(wordTokens);
    });
    return tokenList;
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
