import { describe } from 'mocha';
import { assert, expect } from 'chai';
import { GenericRedditService } from '../../../lib/reddit/services/reddit.service';
import { FrontPageService } from '../../../lib/reddit/services/front-page.service';
import _ from 'lodash';
import Sinon from 'sinon';

const subreddit = 'wallstreetbets';

describe('Reddit::', () => {
    let sandbox: Sinon.SinonSandbox;
    let stubs: any = {};
    describe('Services::', () => {
        describe('Generic::', () => {
            beforeEach(() => {
                sandbox = Sinon.createSandbox();
                stubs.frontPageServiceStub = sandbox.stub(FrontPageService.prototype, 'service').resolves();
            });
            afterEach(() => {
                sandbox.restore();
            });

            it('Should execute happy path for front-page service', async () => {
                const serviceInst = new GenericRedditService({
                    analyzer: 'natural',
                    filterFlags: {},
                    serviceAnalysisType: 'front-page',
                    subreddit: subreddit
                });
                await serviceInst.service();
                expect(stubs.frontPageServiceStub.callCount).to.equal(1);
            });
            it('Should execute unhappy path for front-page service', async () => {
                stubs.frontPageServiceStub.rejects(Error('err'));
                const serviceInst = new GenericRedditService({
                    analyzer: 'natural',
                    filterFlags: {},
                    serviceAnalysisType: 'front-page',
                    subreddit: subreddit
                });
                try {
                    await serviceInst.service();
                } catch (err) {
                    assert(err);
                    expect(err.message).to.equal('err');
                    expect(stubs.frontPageServiceStub.callCount).to.equal(1);
                }
            });
        });
    });
});