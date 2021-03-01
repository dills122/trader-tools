import { describe } from 'mocha';
import { expect, assert } from 'chai';
import * as RedditService from '../../lib/social/reddit/reddit.service';
import * as RedditMock from '../../mocks/reddit.mock';
import got from 'got';
import Sinon from 'sinon';
import _ from 'lodash';

const SmallSubredditList = ['subredditOne', 'subredditTwo'];
const FakeURL = 'fake.url/';

describe('Social::', function () {
    describe('Reddit::', () => {
        describe('Service::', () => {
            let sandbox: Sinon.SinonSandbox;
            let stubs: any = {};

            beforeEach(() => {
                sandbox = Sinon.createSandbox();
                stubs.gotGetStub = sandbox.stub(got, 'get').resolves({
                    body: JSON.stringify(RedditMock.getRawResult('link'))
                });
            });

            afterEach(() => {
                sandbox.restore();
            });

            describe('getFrontPageOfSubreddit::', () => {
                it('Should have front page data returned', async () => {
                    const frontPageResults = await RedditService.getFrontPageOfSubreddit(RedditService.subredditsConfig[0]);
                    expect(frontPageResults.data.children.length).to.equal(5);
                    expect(frontPageResults.kind).to.equal(RedditMock.RedditRawResultBase.kind);
                    expect(frontPageResults.data.dist).to.equal(RedditMock.RedditRawResultBase.data.dist);
                    expect(frontPageResults.data.modhash).to.equal(RedditMock.RedditRawResultBase.data.modhash);
                });
                it('Should throw if got errors out', async () => {
                    stubs.gotGetStub.rejects(Error('err'));
                    try {
                        await RedditService.getFrontPageOfSubreddit(RedditService.subredditsConfig[0]);
                    } catch (err) {
                        assert(err);
                        expect(err.message).to.equal('err');
                    }
                });
            });

            describe('getAllSubredditsFrontPages::', () => {
                beforeEach(() => {
                    stubs.getSubredditsStub = sandbox.stub(RedditService, 'getSubreddits').returns(SmallSubredditList);
                    stubs.gotGetStub.onCall(0).resolves({
                        body: JSON.stringify(RedditMock.getRawResult('link', 5, SmallSubredditList[0]))
                    }).onCall(1).resolves({
                        body: JSON.stringify(RedditMock.getRawResult('link', 5, SmallSubredditList[1]))
                    });
                });

                it('Should get an aggregated list of post from all the subreddits front page', async () => {
                    const aggregatedPosts = await RedditService.getAllSubredditsFrontPages();
                    assert(aggregatedPosts);
                    expect(aggregatedPosts).length(10);
                    expect(stubs.gotGetStub.callCount).to.equal(2);
                    expect(aggregatedPosts.some((post) => post.data.subreddit === SmallSubredditList[0])).to.be.true;
                    expect(aggregatedPosts.some((post) => post.data.subreddit === SmallSubredditList[1])).to.be.true;
                });

                it('Should filter out any entities that are not link schema', async () => {
                    stubs.gotGetStub.onCall(0).resolves({
                        body: JSON.stringify(RedditMock.getRawResult('link', 5, SmallSubredditList[0]))
                    }).onCall(1).resolves({
                        body: JSON.stringify(RedditMock.getRawResult('comment', 5, SmallSubredditList[1]))
                    });
                    const aggregatedPosts = await RedditService.getAllSubredditsFrontPages();
                    assert(aggregatedPosts);
                    expect(aggregatedPosts).length(5);
                    expect(stubs.gotGetStub.callCount).to.equal(2);
                    expect(aggregatedPosts.some((post) => post.data.subreddit === SmallSubredditList[0])).to.be.true;
                    expect(aggregatedPosts.some((post) => post.data.subreddit === SmallSubredditList[1])).to.be.false;
                });

                it('Should error out if no posts were found after gathering all subreddits front pages', async () => {
                    stubs.gotGetStub.onCall(0).resolves({
                        body: JSON.stringify(RedditMock.getRawResult('link', 0, SmallSubredditList[0]))
                    }).onCall(1).resolves({
                        body: JSON.stringify(RedditMock.getRawResult('link', 0, SmallSubredditList[1]))
                    });
                    try {
                        const aggregatedPosts = await RedditService.getAllSubredditsFrontPages();
                        assert(!aggregatedPosts);
                    } catch (err) {
                        expect(stubs.gotGetStub.callCount).to.equal(2);
                        assert(err);
                        expect(err.message).to.equal('Issue with data source, no results returned');
                    }
                });
            });

            describe('getDiscussionCommentThread::', () => {
                beforeEach(() => {
                    const linkMock = RedditMock.getRawResult('link', 1);
                    const commentMock = RedditMock.getRawResult('comment', 5);
                    stubs.gotGetStub.resolves({
                        body: JSON.stringify([
                            linkMock,
                            commentMock
                        ])
                    });
                });

                it('Should gather all comments from the discussion thread', async () => {
                    const comments = await RedditService.getDiscussionCommentThread(RedditService.baseURL);
                    assert(comments);
                    expect(comments).length(5);
                    expect(stubs.gotGetStub.callCount).to.equal(1);
                });
                it('Should error out due to unsupported url', async () => {
                    try {
                        const comments = await RedditService.getDiscussionCommentThread(FakeURL);
                        assert(!comments);
                    } catch (err) {
                        assert(err);
                        expect(err.message).to.equal('Unsupported URL');
                    }
                });
                //Very unusual error cases
                it('Should error out due to empty results being returned', async () => {
                    stubs.gotGetStub.resolves({
                        body: JSON.stringify([])
                    });
                    try {
                        const comments = await RedditService.getDiscussionCommentThread(RedditService.baseURL);
                        assert(!comments);
                    } catch (err) {
                        assert(err);
                        expect(err.message).to.equal('Unexpected data structure returned');
                    }
                });
                it('Should error out if data list is of incorrect type', async () => {
                    stubs.gotGetStub.resolves({
                        body: JSON.stringify([
                            RedditMock.getRawResult('link', 1),
                            RedditMock.getRawResult('link')
                        ])
                    });
                    try {
                        const comments = await RedditService.getDiscussionCommentThread(RedditService.baseURL);
                        assert(!comments);
                    } catch (err) {
                        assert(err);
                        expect(err.message).to.equal('Mismatched returned data');
                    }
                });
            });

            describe('getPostAndCommentThread::', () => {
                beforeEach(() => {
                    stubs.gotGetStub.resolves({
                        body: JSON.stringify([
                            RedditMock.getRawResult('link', 1),
                            RedditMock.getRawResult('comment')
                        ])
                    });
                });

                it('Should gather all comments from the discussion thread', async () => {
                    stubs.gotGetStub.restore();
                    const linkObj = RedditMock.getRawResult('link', 1);
                    // console.log(JSON.stringify(linkObj, null, 4));

                    const comments = RedditMock.getRawResult('comment');
                    // console.log(JSON.stringify(comments, null, 4));
                    stubs.gotGetStub = sandbox.stub(got, 'get').resolves({
                        body: JSON.stringify([
                            linkObj,
                            comments
                        ])
                    });
                    const resp = await RedditService.getPostAndCommentThread(RedditService.baseURL);
                    assert(resp);
                    expect(resp.title).to.equal(RedditMock.RedditLinkSchemaBase.data.title);
                    expect(resp.body).to.equal(RedditMock.RedditLinkSchemaBase.data.selftext);
                    expect(resp.discussion).length(5);
                    expect(stubs.gotGetStub.callCount).to.equal(1);
                });
                it('Should error out due to unsupported url', async () => {
                    try {
                        const resp = await RedditService.getPostAndCommentThread(FakeURL);
                        assert(!resp);
                    } catch (err) {
                        assert(err);
                        expect(err.message).to.equal('Unsupported URL');
                    }
                });
                //Very unusual error cases
                it('Should error out due to empty results being returned', async () => {
                    stubs.gotGetStub.resolves({
                        body: JSON.stringify([])
                    });
                    try {
                        const resp = await RedditService.getPostAndCommentThread(RedditService.baseURL);
                        assert(!resp);
                    } catch (err) {
                        assert(err);
                        expect(err.message).to.equal('Unexpected data structure returned');
                    }
                });
                it('Should error out if data list is of incorrect type', async () => {
                    stubs.gotGetStub.resolves({
                        body: JSON.stringify([
                            RedditMock.getRawResult('link', 1),
                            RedditMock.getRawResult('link')
                        ])
                    });
                    try {
                        const resp = await RedditService.getPostAndCommentThread(RedditService.baseURL);
                        assert(!resp);
                    } catch (err) {
                        assert(err);
                        expect(err.message).to.equal('Mismatched returned data');
                    }
                });
                it('Should error out if data list is of incorrect type', async () => {
                    stubs.gotGetStub.resolves({
                        body: JSON.stringify([
                            RedditMock.getRawResult('comment', 1),
                            RedditMock.getRawResult('link')
                        ])
                    });
                    try {
                        const resp = await RedditService.getPostAndCommentThread(RedditService.baseURL);
                        assert(!resp);
                    } catch (err) {
                        assert(err);
                        expect(err.message).to.equal('No post info found');
                    }
                });
            });
        });
    });
});