import { describe } from 'mocha';
import { Socials, Mocks } from 'api-service';
import { expect, assert } from 'chai';
import Sinon from 'sinon';
import * as Gatherer from '../../../lib/reddit/gatherer-services/front-page-gatherer.service';

const RedditMocks = Mocks.Snoowrap;

const Subreddit = 'wallstreetbets';

describe('Gatherer::', function () {
  let sandbox: Sinon.SinonSandbox;
  const stubs: any = {};
  describe('FrontPageGatherer::', () => {
    beforeEach(() => {
      sandbox = Sinon.createSandbox();
      stubs.getFrontPageOfSubredditStub = sandbox
        .stub(Socials.Reddit.FrontPageService.Service, 'getFrontPage')
        .resolves(RedditMocks.getPostList(5));
      stubs.getPostDiscussionStub = sandbox
        .stub(Socials.Reddit.PostDiscussionService.Service, 'getPostDiscussion')
        .resolves(RedditMocks.getCommentList(5));
    });
    afterEach(() => {
      sandbox.restore();
    });
    it('Should execute happy path', async () => {
      try {
        const rawData = await Gatherer.frontPageGather(Subreddit);
        assert(rawData);
        expect(rawData).length(5);
      } catch (err) {
        assert(!err);
      }
    });
    it('Should execute happy path', async () => {
      stubs.getFrontPageOfSubredditStub.resolves([]);
      try {
        const rawData = await Gatherer.frontPageGather(Subreddit);
        assert(rawData);
        expect(rawData).length(0);
      } catch (err) {
        assert(err);
      }
    });
    it('Should execute unhappy path', async () => {
      stubs.getFrontPageOfSubredditStub.rejects(Error('err'));
      try {
        const rawData = await Gatherer.frontPageGather(Subreddit);
        assert(!rawData, 'It did not go thru un happy path');
      } catch (err) {
        assert(err);
        expect((err as Error).message).to.equal('err');
      }
    });
  });
});
