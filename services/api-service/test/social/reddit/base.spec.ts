// import { assert } from 'chai';
// import Sinon from 'sinon';
// import * as dotenv from 'dotenv';
// import * as Base from '../../../lib/social/reddit/base.service';

// describe('Social::', function () {
//   describe('Snoowrap::', () => {
//     describe('Base::', () => {
//       let sandbox: Sinon.SinonSandbox;
//       const stubs: any = {};
//       beforeEach(() => {
//         sandbox = Sinon.createSandbox();
//         stubs.dotEnvConfigStub = sandbox.stub(dotenv, 'config').returns({});
//         stubs.userAgentStub = sandbox.stub(process, 'env').value({
//           REDDIT_USER_AGENT: undefined
//         });
//       });
//       afterEach(() => {
//         sandbox.restore();
//       });

//       it('Should throw since a env variable is missing', () => {
//         const thrws = () => Base.connect();
//         assert.throws(thrws);
//       });
//     });
//   });
// });
