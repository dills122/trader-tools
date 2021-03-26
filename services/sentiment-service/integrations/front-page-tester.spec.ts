import { assert, expect } from 'chai';
import { Generic } from '../lib/services';

describe('Tester::', function () {
  this.timeout(400000);
  it('Should run', async () => {
    const service = new Generic.GenericSentimentAnalysisService({
      analyzer: 'natural',
      serviceAnalysisType: 'front-page',
      socialSource: 'reddit',
      filterFlags: {
        discussionMode: true
      },
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
