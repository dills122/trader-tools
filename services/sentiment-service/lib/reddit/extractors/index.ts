import { Extractor, ExtractorArgs } from '../../extractors/base';
import { config } from '../config';

const FilterPatterns = config.tickerFilterPatterns;

export class RedditExtractor extends Extractor {
  constructor(args?: ExtractorArgs) {
    super(args);
    if (this.filterPattern.length === 0) {
      this.filterPattern = FilterPatterns;
    }
  }
}
