import { describe } from 'mocha';
import { assert, expect } from 'chai';
import * as BaseRequest from '../../lib/polygon-io/base-request.service';
import Sinon from 'sinon';

const FAKE_ENDPOINT = 'fake/url';

describe('PolygonIO::', function () {
  let sandbox: Sinon.SinonSandbox;
  const stubs: any = {};

  beforeEach(() => {
    sandbox = Sinon.createSandbox();
    stubs.gotGetStub = sandbox.stub(BaseRequest.tokenPlugin, 'get').resolves({
      body: '{"value":"string"}'
    });
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('BaseRequest::', () => {
    it('Should run happy path', async () => {
      const resp: any = await BaseRequest.polygonIOApiRequest(FAKE_ENDPOINT);
      assert(resp);
      expect(resp).to.be.a('object');
      expect(resp.value).to.be.a('string').and.equal('string');
    });

    it('Should run happy path, typed', async () => {
      const resp = await BaseRequest.polygonIOApiRequest<{
        value: string;
      }>(FAKE_ENDPOINT);
      assert(resp);
      expect(resp).to.be.a('object');
      expect(resp.value).to.be.a('string').and.equal('string');
    });

    it('Should run unhappy path', async () => {
      stubs.gotGetStub.rejects(Error('err'));
      try {
        const resp = await BaseRequest.polygonIOApiRequest<{
          value: string;
        }>(FAKE_ENDPOINT);
        assert(!resp);
      } catch (err: any) {
        assert(err);
        assert(err.message);
        expect(err.message).to.equal('err');
      }
    });
  });
});
