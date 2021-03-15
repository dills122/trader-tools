import { assert, expect } from 'chai';
import Sinon from 'sinon';
import * as Base from '../../../lib/social/reddit/snoowrap/base.service';
import * as FrontPage from '../../../lib/social/reddit/snoowrap/front-page/front-page.service';

const subreddit = 'wallstreetbets';

describe('Social::', function () {
    describe('Snoowrap::', () => {
        describe('FrontPage::', () => {
            let sandbox: Sinon.SinonSandbox;
            let stubs: any = {};
            beforeEach(() => {
                sandbox = Sinon.createSandbox();
                stubs.getHotStub = sandbox.stub().returns([]);
                stubs.connectStub = sandbox.stub(Base, 'connect').returns(<any>{
                    getSubreddit: sandbox.stub().returnsThis(),
                    getHot: stubs.getHotStub
                });
            });
            afterEach(() => {
                sandbox.restore();
            });

            it('Should execute happy path, get empty result set', async () => {
                const posts = await FrontPage.getFrontPage(subreddit);
                assert(posts);
                expect(posts).to.have.length(0);
                expect(stubs.connectStub.callCount).to.equal(1);
                expect(stubs.getHotStub.callCount).to.equal(1);
            });
        });
    });
});