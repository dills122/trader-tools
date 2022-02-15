import { describe } from 'mocha';
import { assert, expect } from 'chai';
import { GenericRedditService } from '../../../lib/reddit/services/reddit.service';
import { FrontPageService } from '../../../lib/reddit/services/front-page.service';
import _ from 'lodash';
import Sinon from 'sinon';
import { FilterType } from '../../../lib/reddit/filters';
import { initialState as OverrideFiltersInitialState } from '../../../lib/reddit/filters';

const subreddit = 'wallstreetbets';

describe('Reddit::', () => {
  let sandbox: Sinon.SinonSandbox;
  const stubs: any = {};
  describe('Services::', () => {
    describe('Generic::', () => {
      beforeEach(() => {
        sandbox = Sinon.createSandbox();
        stubs.frontPageServiceStub = sandbox.stub(FrontPageService.prototype, 'service').resolves();
        stubs.consoleErrStub = sandbox.stub(console, 'error').returns();
      });
      afterEach(() => {
        sandbox.restore();
      });

      it('Should execute happy path for front-page service', async () => {
        const serviceInst = new GenericRedditService({
          analyzer: 'natural',
          filterType: FilterType.general,
          serviceAnalysisType: 'front-page',
          subreddit: subreddit,
          overrideTypes: OverrideFiltersInitialState
        });
        await serviceInst.service();
        expect(stubs.frontPageServiceStub.callCount).to.equal(1);
      });
      it('Should execute unhappy path for front-page service', async () => {
        stubs.frontPageServiceStub.rejects(Error('err'));
        const serviceInst = new GenericRedditService({
          analyzer: 'natural',
          filterType: FilterType.general,
          serviceAnalysisType: 'front-page',
          subreddit: subreddit,
          overrideTypes: OverrideFiltersInitialState
        });
        try {
          await serviceInst.service();
        } catch (err) {
          assert(err);
          expect((err as Error).message).to.equal('err');
          expect(stubs.frontPageServiceStub.callCount).to.equal(1);
        }
      });
    });
  });
});
