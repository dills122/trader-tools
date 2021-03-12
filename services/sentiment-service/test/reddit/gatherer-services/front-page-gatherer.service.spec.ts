import { describe } from 'mocha';
import { Socials, Mocks } from 'api-service';
import { expect, assert } from 'chai';
import Sinon from 'sinon';
import * as Gatherer from '../../../lib/reddit/gatherer-services/front-page-gatherer.service';

const RedditMocks = Mocks.Reddit;

const Subreddit = 'wallstreetbets';


describe('Gatherer::', function () {
    let sandbox: Sinon.SinonSandbox;
    let stubs: any = {};
    describe('FrontPageGatherer::', () => {
        beforeEach(() => {
            sandbox = Sinon.createSandbox();
            stubs.getFrontPageOfSubredditStub = sandbox.stub(Socials.Reddit.Service, 'getFrontPageOfSubreddit').resolves(RedditMocks.getRawResult('link'));
        });
        afterEach(() => {
            sandbox.restore();
        });
        it('Should execute happy path', async () => {
            try {
                const rawData = await Gatherer.gather(Subreddit);
                assert(rawData);
                expect(rawData).length(5);
            } catch (err) {
                assert(!err);
            }
        });
        it('Should execute happy path', async () => {
            const rawMock = RedditMocks.getRawResult('link');
            rawMock.data.children = [];
            stubs.getFrontPageOfSubredditStub.resolves(rawMock);
            try {
                const rawData = await Gatherer.gather(Subreddit);
                assert(rawData);
                expect(rawData).length(0);
            } catch (err) {
                assert(!err);
            }
        });
        it('Should execute unhappy path', async () => {
            stubs.getFrontPageOfSubredditStub.rejects(Error('err'));
            try {
                const rawData = await Gatherer.gather(Subreddit);
                assert(!rawData);
            } catch (err) {
                assert(err);
                expect(err.message).to.equal('err');
            }
        });
    });
});