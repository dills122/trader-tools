import { assert, expect } from 'chai';
import Sinon from 'sinon';
import * as Base from '../../../lib/social/reddit/base.service';
import * as FrontPage from '../../../lib/social/reddit/front-page/front-page.service';
// import { getPostList } from '../../../mocks/snoowrap/index.mock';

const subreddit = 'wallstreetbets';

describe('Social::', function () {
    describe('Snoowrap::', () => {
        describe('FrontPage::', () => {
            let sandbox: Sinon.SinonSandbox;
            let stubs: any = {};
            beforeEach(() => {
                sandbox = Sinon.createSandbox();
                stubs.getHotStub = sandbox.stub().resolves([]);
                stubs.connectStub = sandbox.stub(Base, 'connect').returns(<any>{
                    getSubreddit: sandbox.stub().returnsThis(),
                    getHot: stubs.getHotStub
                });
                stubs.consoleError = sandbox.stub(console, 'error').returns();
            });
            afterEach(() => {
                sandbox.restore();
            });

            it('Should throw due to no posts being found', async () => {
                try {
                    await FrontPage.getFrontPage(subreddit);
                } catch(err) {
                    assert(err);
                    expect(err.message).to.equal('No posts found');
                    expect(stubs.connectStub.callCount).to.equal(1);
                    expect(stubs.getHotStub.callCount).to.equal(1);
                }

            });
            // it('Should execute happy path', async () => {
            //     stubs.getHotStub.resolves(getPostList(2));
            //     const posts = await FrontPage.getFrontPage(subreddit);
            //     assert(posts);
            //     expect(posts.length).to.equal(2);
            //     expect(stubs.connectStub.callCount).to.equal(1);
            //     expect(stubs.getHotStub.callCount).to.equal(1);
            // });
        });
    });
});