import { describe } from 'mocha';
import { assert, expect } from 'chai';
import { flairConfig, FlairFilter } from '../../../lib/reddit/filters/flair-filter';
import { FilterType } from '../../../lib/reddit/filters';

const subreddit = 'wallstreetbets';
const GoodFlair = flairConfig.subreddits.wallstreetbets.good[0];
const BadFlair = flairConfig.subreddits.wallstreetbets.bad[0];
const NeturalFlair = flairConfig.subreddits.wallstreetbets.netural[0];

describe('Reddit::', () => {
  describe('Filters::', () => {
    describe('FlairFilter::', () => {
      it('Should execute happy path for shitpost filter type', () => {
        const isApproved = new FlairFilter({
          filterType: FilterType.shitpost,
          subreddit: subreddit,
          flair: GoodFlair
        }).filter();
        expect(isApproved).to.be.false;
      });
      it('Should execute happy path for shitpost filter type', () => {
        const isApproved = new FlairFilter({
          filterType: FilterType.shitpost,
          subreddit: subreddit,
          flair: NeturalFlair
        }).filter();
        expect(isApproved).to.be.false;
      });
      it('Should execute happy path for shitpost filter type and filter out', () => {
        const isApproved = new FlairFilter({
          filterType: FilterType.shitpost,
          subreddit: subreddit,
          flair: BadFlair
        }).filter();
        expect(isApproved).to.be.true;
      });
      it('Should execute happy path for discussion filter type', () => {
        const isApproved = new FlairFilter({
          filterType: FilterType.discussion,
          subreddit: subreddit,
          flair: 'discussion'
        }).filter();
        expect(isApproved).to.be.true;
      });
      it('Should execute happy path for discussion filter type and filter out', () => {
        const isApproved = new FlairFilter({
          filterType: FilterType.discussion,
          subreddit: subreddit,
          flair: BadFlair
        }).filter();
        expect(isApproved).to.be.false;
      });
      it('Should execute happy path for chaos filter type', () => {
        const isApproved = new FlairFilter({
          filterType: FilterType.chaos,
          subreddit: subreddit,
          flair: BadFlair
        }).filter();
        expect(isApproved).to.be.true;
      });
      it('Should execute happy path for chaos filter type and filter out', () => {
        const isApproved = new FlairFilter({
          filterType: FilterType.chaos,
          subreddit: subreddit,
          flair: GoodFlair
        }).filter();
        expect(isApproved).to.be.true;
      });
      it('Should error out if a not supported subreddit is given', () => {
        const thrws = () =>
          new FlairFilter({
            filterType: FilterType.chaos,
            subreddit: 'fake',
            flair: GoodFlair
          });
        assert.throws(thrws);
      });
    });
  });
});
