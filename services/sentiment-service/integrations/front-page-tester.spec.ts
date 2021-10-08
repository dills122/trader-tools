import { assert, expect } from 'chai';
import { FilterType } from '../lib/reddit/filters';
import { Generic } from '../lib/services';

describe('Tester::', function () {
  this.timeout(400000);
  it('Should run', async () => {
    const service = new Generic.GenericSentimentAnalysisService({
      analyzer: 'natural',
      serviceAnalysisType: 'front-page',
      socialSource: 'reddit',
      filterType: FilterType.general,
      subreddit: 'wallstreetbets'
    });

    try {
      const results = await service.analyze();
      assert(results);
      expect(results.length).to.be.greaterThan(1);
      console.log(results);
    } catch (err) {
      console.error(err);
      assert(!err);
    }
  });
});
