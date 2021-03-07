import { describe } from 'mocha';
import { Socials, Mocks } from 'api-service';
import { expect, assert } from 'chai';
import Sinon from 'sinon';
import { GenericSentimentAnalysisService } from '../../lib/services/generic-sentiment-analysis.service';
// import { GenericService } from '../../lib/reddit/services';
import _ from 'lodash';

const subreddit = 'wallstreetbets';
const title = 'This is a title';
const body = 'This is the body of the post';

describe("Services::", function () {
    let sandbox: Sinon.SinonSandbox;
    // let stubs: any = {};
    let spies: any = {};
    let stubs: any = {};
    describe('SentimentAnalysis::', () => {
        beforeEach(() => {
            sandbox = Sinon.createSandbox();
            spies.setFilterFlagsSpy = sandbox.spy(GenericSentimentAnalysisService.prototype, <any>'setFilterFlags');
            spies.analyzeFilterFlagsSpy = sandbox.spy(GenericSentimentAnalysisService.prototype, <any>'analyzeFilterFlags');
            spies.disableAllFilterFlagsOfTypeSpy = sandbox.spy(GenericSentimentAnalysisService.prototype, <any>'disableAllFilterFlagsOfType');
            const discussionPost = Mocks.Reddit.getLinkList(1, subreddit)[0];
            discussionPost.data.link_flair_text = 'discussion';
            const nonDiscussionPost = Mocks.Reddit.getLinkList(1, subreddit)[0];
            nonDiscussionPost.data.link_flair_text = 'meme';
            const rawData = Mocks.Reddit.getRawResult('link', 0, subreddit);
            rawData.data.children = [discussionPost, nonDiscussionPost];
            stubs.getFrontPageOfSubredditStub = sandbox.stub(Socials.Reddit.Service, 'getFrontPageOfSubreddit').resolves(rawData);
            stubs.getFrontPageOfSubredditStub = sandbox.stub(Socials.Reddit.Service, 'getPostAndCommentThread').resolves(Mocks.Reddit.getRedditPostAndThreadResult(title, body, 5, subreddit));
        });
        afterEach(() => {
            sandbox.restore();
        });
        describe('Analyze::', () => {
            it('should go through the happy path', async () => {
                const serviceInst = new GenericSentimentAnalysisService({
                    analyzer: 'natural',
                    serviceAnalysisType: 'front-page',
                    socialSource: 'reddit',
                    subreddit: subreddit
                });
                assert(serviceInst);
                expect(spies.setFilterFlagsSpy.callCount).to.equal(1);
                const setArgs = spies.setFilterFlagsSpy.args[0][0];
                assert(setArgs);
                assert(setArgs.discussionMode);
                expect(_.keys(setArgs)).length(1);
                expect(spies.analyzeFilterFlagsSpy.callCount).to.equal(1);
                expect(spies.disableAllFilterFlagsOfTypeSpy.callCount).to.equal(0);

                await serviceInst.analyze();
            });

            it('should throw due to an unsupported social source', async () => {
                const serviceInst = new GenericSentimentAnalysisService({
                    analyzer: 'natural',
                    serviceAnalysisType: 'front-page',
                    socialSource: 'reddit'
                });
                const anySI = serviceInst as any;

                assert(serviceInst);
                expect(spies.setFilterFlagsSpy.callCount).to.equal(1);
                const setArgs = spies.setFilterFlagsSpy.args[0][0];
                assert(setArgs);
                assert(setArgs.discussionMode);
                expect(_.keys(setArgs)).length(1);
                expect(spies.analyzeFilterFlagsSpy.callCount).to.equal(1);
                expect(spies.disableAllFilterFlagsOfTypeSpy.callCount).to.equal(0);
                //Iillegally set the social source to an invalid value
                anySI.socialSource = 'fake';
                try {
                    await serviceInst.analyze();
                    assert(undefined);
                } catch (err) {
                    assert(err);
                    expect(err.message).to.equal('Unsupported social source provided');
                }
            });
        });
        describe('FilterFlags::', () => {
            it('Should set default case if no filter flags are given', () => {
                const serviceInst = new GenericSentimentAnalysisService({
                    analyzer: 'natural',
                    serviceAnalysisType: 'front-page',
                    socialSource: 'reddit'
                });
                assert(serviceInst);
                expect(spies.setFilterFlagsSpy.callCount).to.equal(1);
                const setArgs = spies.setFilterFlagsSpy.args[0][0];
                assert(setArgs);
                assert(setArgs.discussionMode);
                expect(_.keys(setArgs)).length(1);
                expect(spies.analyzeFilterFlagsSpy.callCount).to.equal(1);
                expect(spies.disableAllFilterFlagsOfTypeSpy.callCount).to.equal(0);
            });
            it('Should set default case if an empty filter flags object is given', () => {
                const serviceInst = new GenericSentimentAnalysisService({
                    analyzer: 'natural',
                    serviceAnalysisType: 'front-page',
                    socialSource: 'reddit',
                    filterFlags: {}
                });
                assert(serviceInst);
                expect(spies.setFilterFlagsSpy.callCount).to.equal(1);
                const setArgs = spies.setFilterFlagsSpy.args[0][0];
                assert(setArgs);
                assert(setArgs.discussionMode);
                expect(_.keys(setArgs)).length(1);
                expect(spies.analyzeFilterFlagsSpy.callCount).to.equal(1);
                expect(spies.disableAllFilterFlagsOfTypeSpy.callCount).to.equal(0);
            });
            it('Should properly set the filter flags given chaos mode', () => {
                const serviceInst = new GenericSentimentAnalysisService({
                    analyzer: 'natural',
                    serviceAnalysisType: 'front-page',
                    socialSource: 'reddit',
                    filterFlags: {
                        chaosMode: true
                    }
                });
                assert(serviceInst);
                expect(spies.setFilterFlagsSpy.callCount).to.equal(1);
                const setArgs = spies.setFilterFlagsSpy.args[0][0];
                assert(setArgs);
                const { discussionMode,
                    chaosMode,
                    ddMode,
                    matureFilter,
                    emojiFilter,
                    hashtagFilter } = setArgs;
                expect(chaosMode).to.be.true;
                expect(discussionMode).to.be.undefined;
                expect(ddMode).to.be.undefined;
                expect(matureFilter).to.be.false;
                expect(emojiFilter).to.be.undefined;
                expect(hashtagFilter).to.be.undefined;
                expect(spies.analyzeFilterFlagsSpy.callCount).to.equal(1);
                expect(spies.disableAllFilterFlagsOfTypeSpy.callCount).to.equal(1);
            });
            it('Should properly set the filter flags given discussion mode', () => {
                const serviceInst = new GenericSentimentAnalysisService({
                    analyzer: 'natural',
                    serviceAnalysisType: 'front-page',
                    socialSource: 'reddit',
                    filterFlags: {
                        discussionMode: true,
                        matureFilter: true
                    }
                });
                assert(serviceInst);
                expect(spies.setFilterFlagsSpy.callCount).to.equal(1);
                const setArgs = spies.setFilterFlagsSpy.args[0][0];
                assert(setArgs);
                const { discussionMode,
                    chaosMode,
                    ddMode,
                    matureFilter,
                    emojiFilter,
                    hashtagFilter } = setArgs;
                expect(chaosMode).to.be.undefined;
                expect(discussionMode).to.be.true;
                expect(ddMode).to.be.undefined;
                expect(matureFilter).to.be.true;
                expect(emojiFilter).to.be.undefined;
                expect(hashtagFilter).to.be.undefined;
                expect(spies.analyzeFilterFlagsSpy.callCount).to.equal(1);
                expect(spies.disableAllFilterFlagsOfTypeSpy.callCount).to.equal(1);
            });
            it('Should properly set the filter flags given dd mode', () => {
                const serviceInst = new GenericSentimentAnalysisService({
                    analyzer: 'natural',
                    serviceAnalysisType: 'front-page',
                    socialSource: 'reddit',
                    filterFlags: {
                        ddMode: true,
                        matureFilter: true
                    }
                });
                assert(serviceInst);
                expect(spies.setFilterFlagsSpy.callCount).to.equal(1);
                const setArgs = spies.setFilterFlagsSpy.args[0][0];
                assert(setArgs);
                const { discussionMode,
                    chaosMode,
                    ddMode,
                    matureFilter,
                    emojiFilter,
                    hashtagFilter } = setArgs;
                expect(chaosMode).to.be.undefined;
                expect(discussionMode).to.be.undefined;
                expect(ddMode).to.be.true;
                expect(matureFilter).to.be.true;
                expect(emojiFilter).to.be.undefined;
                expect(hashtagFilter).to.be.undefined;
                expect(spies.analyzeFilterFlagsSpy.callCount).to.equal(1);
                expect(spies.disableAllFilterFlagsOfTypeSpy.callCount).to.equal(1);
            });
        });
    });
});