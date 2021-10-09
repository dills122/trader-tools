import { expect } from 'chai';
import { FilterType, initialState as OverrideFiltersInitialState } from '../../lib/reddit/filters';
import { GenericSentimentAnalysisService } from '../../lib/services/generic-sentiment-analysis.service';

describe('GenericSentimentAnalysisService', () => {
  it('should properly setup override types if non are provided', () => {
    const service = new GenericSentimentAnalysisService({
      analyzer: 'natural',
      serviceAnalysisType: 'front-page',
      socialSource: 'reddit',
      filterType: FilterType.general,
      subreddit: 'wallstreetbets'
    });
    expect((service as any).overrideTypes).to.deep.equal(OverrideFiltersInitialState);
  });
  it('should properly setup override types if some are provided', () => {
    const service = new GenericSentimentAnalysisService({
      analyzer: 'natural',
      serviceAnalysisType: 'front-page',
      socialSource: 'reddit',
      filterType: FilterType.general,
      subreddit: 'wallstreetbets',
      overrideTypes: {
        matureLanguageFilter: false
      }
    });
    expect((service as any).overrideTypes).to.deep.equal({
      ...OverrideFiltersInitialState,
      matureLanguageFilter: false
    });
  });
});
