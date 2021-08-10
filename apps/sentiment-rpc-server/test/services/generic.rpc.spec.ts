import grpcTools from 'grpc-tools';
import { describe } from 'mocha';
import { expect } from 'chai';
import Sinon from 'sinon';
import GenericRPC from '../../src/services/generic/generic.rpc';

const subreddit = 'wallstreetbets';

describe('RPC::', function () {
  describe('RPC::', function () {
    let sandbox: Sinon.SinonSandbox;
    const stubs: any = {};

    beforeEach(() => {
      sandbox = Sinon.createSandbox();
      stubs.waitForReadyStub = sandbox.stub().callsArg(1);
      stubs.AnalyzeStub = sandbox.stub().callsArgWith(1, null, {
        analysisResults: []
      });
      stubs.clientFactoryStub = sandbox.stub(grpcTools, 'clientFactory').returns({
        waitForReady: stubs.waitForReadyStub,
        Analyze: stubs.AnalyzeStub
      });
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('Should resolve if no error returned', async () => {
      const results = await GenericRPC({
        analyzer: 'natural',
        serviceAnalysisType: 'front-page',
        socialSource: 'reddit',
        subreddit: subreddit
      });
      expect(stubs.waitForReadyStub.callCount).to.equal(1);
      expect(stubs.AnalyzeStub.callCount).to.equal(1);
      expect(results).to.be.an('array').and.have.length(0);
    });
    it('Should fail if wait returns error', async () => {
      stubs.waitForReadyStub.callsArgWith(1, Error('ERR'));
      try {
        const results = await GenericRPC({
          analyzer: 'natural',
          serviceAnalysisType: 'front-page',
          socialSource: 'reddit',
          subreddit: subreddit
        });
        expect(results).to.be.not.undefined;
      } catch (err) {
        expect(err.message).to.equal('Client connection error');
        expect(stubs.waitForReadyStub.callCount).to.equal(1);
        expect(stubs.AnalyzeStub.callCount).to.equal(0);
      }
    });
    it('Should fail if Analyze returns error', async () => {
      stubs.AnalyzeStub.callsArgWith(1, Error('ERR'));
      try {
        const results = await GenericRPC({
          analyzer: 'natural',
          serviceAnalysisType: 'front-page',
          socialSource: 'reddit',
          subreddit: subreddit
        });
        expect(results).to.be.not.undefined;
      } catch (err) {
        expect(err.message).to.equal('ERR');
        expect(stubs.waitForReadyStub.callCount).to.equal(1);
        expect(stubs.AnalyzeStub.callCount).to.equal(1);
      }
    });
  });
});
