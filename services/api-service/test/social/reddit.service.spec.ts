import { describe } from 'mocha';
import { expect, assert } from 'chai';
import * as RedditService from '../../lib/social/reddit/reddit.service';
import * as RedditMock from '../../mocks/reddit.mock';
import got from 'got';
import Sinon from 'sinon';

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
                    const frontPageResults = await RedditService.getFrontPageOfSubreddit(RedditService.subreddits[0]);
                    expect(frontPageResults.data.children.length).to.equal(5);
                    expect(frontPageResults.kind).to.equal(RedditMock.RedditRawResultBase.kind);
                    expect(frontPageResults.data.dist).to.equal(RedditMock.RedditRawResultBase.data.dist);
                    expect(frontPageResults.data.modhash).to.equal(RedditMock.RedditRawResultBase.data.modhash);
                });
                it('Should throw if got errors out', async () => {
                    stubs.gotGetStub.rejects(Error('err'));
                    try {
                        await RedditService.getFrontPageOfSubreddit(RedditService.subreddits[0]);
                    } catch (err) {
                        assert(err);
                        expect(err.message).to.equal('err');
                    }
                });
            });
        });
    });
});