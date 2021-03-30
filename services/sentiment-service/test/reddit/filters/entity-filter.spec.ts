import { describe } from 'mocha';
import { assert, expect } from 'chai';
import { EntityFilter } from '../../../lib/reddit/filters/entity-filter';
import { Mocks, Socials } from 'api-service';
import _ from 'lodash';

const subreddit = 'wallstreetbets';

describe('Reddit::', () => {
  let mocks: Socials.Reddit.Types.Comment[] = [];
  describe('Filters::', () => {
    describe('EntityFilter::', () => {
      beforeEach(() => {
        mocks = _.cloneDeep(Mocks.Snoowrap.getCommentList(2, subreddit));
        const first = mocks[0];
        const second = mocks[1];
        first.stickied = true;
        second.body = 'The stock $ABR is really looking good';
      });

      it('Should error out if no string is inputted', () => {
        const entityFilter = new EntityFilter();
        const thrws = () => entityFilter.filter();
        assert.throws(thrws);
      });
      it('Should execute happy path', () => {
        const testStr = 'This is a test str';
        const entityFilter = new EntityFilter();
        const filteredStr = entityFilter.filter(testStr);
        assert(filteredStr);
        expect(filteredStr).to.equal(testStr);
        expect(filteredStr).to.equal(entityFilter.getCleanString());
      });
      it('Should execute happy path', () => {
        const testStr = 'This is a test str';
        const entityFilter = new EntityFilter({
          stringToAnalyze: testStr
        });
        const filteredStr = entityFilter.filter(testStr);
        expect(filteredStr).to.equal(testStr);
        expect(filteredStr).to.equal(entityFilter.getCleanString());
      });
      it('Should execute happy path and remove new-line characters', () => {
        const testStr = 'This is a test str.\n Hello \n';
        const entityFilter = new EntityFilter({
          stringToAnalyze: testStr
        });
        const filteredStr = entityFilter.filter(testStr);
        expect(filteredStr).to.not.equal(testStr);
        expect(filteredStr).to.equal(entityFilter.getCleanString());
      });
      it('Should execute happy path and remove markdown links', () => {
        const testStr =
          'This is a test str. Hello. [https://www.channelnewsasia.com/news/business/goldman-sold-us-10-5-billion-of-stocks-in-block-trade-spree--bloomberg-news-14507154](https://www.channelnewsasia.com/news/business/goldman-sold-us-10-5-billion-of-stocks-in-block-trade-spree--bloomberg-news-14507154)';
        const entityFilter = new EntityFilter({
          stringToAnalyze: testStr
        });
        const filteredStr = entityFilter.filter(testStr);
        expect(filteredStr).to.not.equal(testStr);
        expect(filteredStr).to.not.include(
          '[https://www.channelnewsasia.com/news/business/goldman-sold-us-10-5-billion-of-stocks-in-block-trade-spree--bloomberg-news-14507154](https://www.channelnewsasia.com/news/business/goldman-sold-us-10-5-billion-of-stocks-in-block-trade-spree--bloomberg-news-14507154)'
        );
        expect(filteredStr).to.equal(entityFilter.getCleanString());
      });
      it('Should execute happy path and remove subreddit mention', () => {
        const testStr = 'Checkout the new subreddit r/TV';
        const entityFilter = new EntityFilter({
          stringToAnalyze: testStr
        });
        const filteredStr = entityFilter.filter(testStr);
        expect(filteredStr).to.not.equal(testStr);
        expect(filteredStr).to.not.include('r/TV');
        expect(filteredStr).to.equal(entityFilter.getCleanString());
      });
    });
  });
});
