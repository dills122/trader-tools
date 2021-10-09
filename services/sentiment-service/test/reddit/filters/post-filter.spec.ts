import { describe } from 'mocha';
import { assert, expect } from 'chai';
import { PostFilter } from '../../../lib/reddit/filters/post-filter';
import { Mocks, Socials } from 'api-service';
import _ from 'lodash';
import { FilterType } from '../../../lib/reddit/filters';
import { initialState as OverrideFiltersInitialState } from '../../../lib/reddit/filters';

const subreddit = 'wallstreetbets';

describe('Reddit::', () => {
  let mocks: Socials.Reddit.Types.Post[] = [];
  describe('Filters::', () => {
    describe('PostFilter::', () => {
      beforeEach(() => {
        mocks = _.cloneDeep(Mocks.Snoowrap.getPostList(2, subreddit));
        const first = mocks[0];
        const second = mocks[1];
        first.flair = 'discussion';
        second.flair = 'meme';
      });

      it('Should execute happy path for discussionMode', () => {
        const filteredPosts = new PostFilter({
          posts: mocks,
          filterType: FilterType.discussion,
          overrideTypes: OverrideFiltersInitialState
        }).filter();
        assert(filteredPosts);
        expect(filteredPosts).to.have.length(1);
        const firstPost = filteredPosts[0];
        assert(firstPost);
        expect(firstPost.flair).to.equal('discussion');
        expect(firstPost.subreddit).to.equal(subreddit);
      });

      it('Should execute happy path for nonShitpostingMode', () => {
        const filteredPosts = new PostFilter({
          posts: mocks,
          filterType: FilterType.discussion,
          overrideTypes: OverrideFiltersInitialState
        }).filter();
        assert(filteredPosts);
        expect(filteredPosts).to.have.length(1);
        const firstPost = filteredPosts[0];
        assert(firstPost);
        expect(firstPost.flair).to.equal('discussion');
        expect(firstPost.subreddit).to.equal(subreddit);
      });

      it('Should execute default happy path, chaos mode', () => {
        const filteredPosts = new PostFilter({
          posts: mocks,
          filterType: FilterType.chaos,
          overrideTypes: OverrideFiltersInitialState
        }).filter();
        assert(filteredPosts);
        expect(filteredPosts).to.have.length(2);
        expect(filteredPosts.some((post) => post.flair === 'meme')).to.be.true;
        expect(filteredPosts.some((post) => post.flair === 'discussion')).to.be.true;
      });

      it('Should execute happy path when empty set is given', () => {
        const filteredPosts = new PostFilter({
          posts: [],
          filterType: FilterType.discussion,
          overrideTypes: OverrideFiltersInitialState
        }).filter();
        assert(filteredPosts);
        expect(filteredPosts).to.have.length(0);
        const firstPost = filteredPosts[0];
        assert(!firstPost);
      });

      it('Should only return posts with a security mentioned in title if postMustContainSecurity flag is present; $TSLA', () => {
        mocks[0].title = 'Dude you should really check out $TSLA, its really going places';
        const filteredPosts = new PostFilter({
          posts: mocks,
          filterType: FilterType.general,
          overrideTypes: {
            ...OverrideFiltersInitialState,
            postMustContainSecurity: true
          }
        }).filter();
        assert(filteredPosts);
        expect(filteredPosts).to.have.length(1);
        expect(filteredPosts.some((post) => post.flair === 'meme')).to.be.false;
        expect(filteredPosts.some((post) => post.flair === 'discussion')).to.be.true;
      });
      it('Should only return posts with a security mentioned in title if postMustContainSecurity flag is present; FB', () => {
        mocks[0].title = 'EVERYONE, checkout out FB before its to late, its going places';
        const filteredPosts = new PostFilter({
          posts: mocks,
          filterType: FilterType.general,
          overrideTypes: {
            ...OverrideFiltersInitialState,
            postMustContainSecurity: true
          }
        }).filter();
        assert(filteredPosts);
        expect(filteredPosts).to.have.length(1);
        expect(filteredPosts.some((post) => post.flair === 'meme')).to.be.false;
        expect(filteredPosts.some((post) => post.flair === 'discussion')).to.be.true;
      });
      it('Should return no posts if postMustContainSecurity flag is present, but non found with current filter mode, general', () => {
        mocks[1].title = 'EVERYONE, checkout out FB before its to late, its going places';
        const filteredPosts = new PostFilter({
          posts: mocks,
          filterType: FilterType.general,
          overrideTypes: {
            ...OverrideFiltersInitialState,
            postMustContainSecurity: true
          }
        }).filter();
        assert(filteredPosts);
        expect(filteredPosts).to.have.length(0);
        expect(filteredPosts.some((post) => post.flair === 'meme')).to.be.false;
        expect(filteredPosts.some((post) => post.flair === 'discussion')).to.be.false;
      });
      it('Should return no posts if postMustContainSecurity flag is present, but non found with current filter mode, general', () => {
        const filteredPosts = new PostFilter({
          posts: mocks,
          filterType: FilterType.general,
          overrideTypes: {
            ...OverrideFiltersInitialState,
            postMustContainSecurity: true
          }
        }).filter();
        assert(filteredPosts);
        expect(filteredPosts).to.have.length(0);
        expect(filteredPosts.some((post) => post.flair === 'meme')).to.be.false;
        expect(filteredPosts.some((post) => post.flair === 'discussion')).to.be.false;
      });
    });
  });
});
