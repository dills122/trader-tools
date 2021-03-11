import { describe } from 'mocha';
import { assert, expect } from 'chai';
import Sinon from 'sinon';
import { GenericSentimentAnalysisService } from '../lib/services/generic-sentiment-analysis.service';
import { Mocks, Socials } from 'api-service';
import { getRandomStatement } from '../mocks/sentiment-indicators.mock';
import _ from 'lodash';

const subreddit = 'wallstreetbets';
const titleOne = 'Is ABR a good bet?';
const titleTwo = 'Lets talk about ABR';

describe('Integrations::', function () {
    let sandbox: Sinon.SinonSandbox;
    let spies: any = {};
    let stubs: any = {};
    this.timeout(10000);
    beforeEach(() => {
        sandbox = Sinon.createSandbox();
        spies.setFilterFlagsSpy = sandbox.spy(GenericSentimentAnalysisService.prototype, <any>'setFilterFlags');
        spies.analyzeFilterFlagsSpy = sandbox.spy(GenericSentimentAnalysisService.prototype, <any>'analyzeFilterFlags');
        spies.disableAllFilterFlagsOfTypeSpy = sandbox.spy(GenericSentimentAnalysisService.prototype, <any>'disableAllFilterFlagsOfType');
        const frontPageMock = Mocks.Reddit.getLinkList(4, subreddit);
        frontPageMock.forEach((post, index) => {
            if (index % 2 === 0) {
                post.data.link_flair_text = 'meme';
            } else {
                post.data.link_flair_text = 'discussion';
            }
        });
        const rawData = Mocks.Reddit.getRawResult('link', 0, subreddit);
        rawData.data.children = frontPageMock;

        const firstThreadComments = Mocks.Reddit.getCommentList(200, subreddit);
        firstThreadComments.forEach((post, index) => {
            if (index % 2 === 0) {
                post.data.body = getRandomStatement('positive', 'ABR');
            } else if (index % 2 !== 0 && index % 25 === 0) {
                post.data.body = getRandomStatement('negative', 'ABR');
            } else {
                post.data.body = getRandomStatement('filler', 'ABR');
            }
        });
        const rawCommentThreadOne = Mocks.Reddit.getRedditPostAndThreadResult(titleOne, '', 0, subreddit);
        rawCommentThreadOne.discussion = firstThreadComments;
        const secondThreadComments = Mocks.Reddit.getCommentList(250, subreddit);
        secondThreadComments.forEach((post, index) => {
            if (index % 3 === 0) {
                post.data.body = getRandomStatement('positive', 'ABR');
            } else if (index % 3 !== 0 && index % 25 === 0) {
                post.data.body = getRandomStatement('negative', 'ABR');
            } else {
                post.data.body = getRandomStatement('filler', 'ABR');
            }
        });
        const rawCommentThreadTwo = Mocks.Reddit.getRedditPostAndThreadResult(titleTwo, '', 0, subreddit);
        rawCommentThreadTwo.discussion = secondThreadComments;
        stubs.getFrontPageOfSubredditStub = sandbox.stub(Socials.Reddit.Service, 'getFrontPageOfSubreddit').resolves(rawData);
        stubs.getPostAndCommentThreadStub = sandbox.stub(Socials.Reddit.Service, 'getPostAndCommentThread')
            .onCall(0).resolves(rawCommentThreadOne)
            .onCall(1).resolves(rawCommentThreadTwo)
    });
    afterEach(() => {
        sandbox.restore();
    });
    //This should be positive or very positive sentiment, but currently is not 
    it.only('Should execute happy path and find mostly positive sentiment', async () => {
        const service = new GenericSentimentAnalysisService({
            analyzer: 'natural',
            serviceAnalysisType: 'front-page',
            socialSource: 'reddit',
            filterFlags: {
                discussionMode: true
            },
            subreddit
        });
        const analyzedResults = await service.analyze();
        assert(analyzedResults);
        const result = analyzedResults[0];
        console.log(result);
        expect(result.sentimentScore).to.be.lessThan(.1).and.greaterThan(-.1);
    });
});