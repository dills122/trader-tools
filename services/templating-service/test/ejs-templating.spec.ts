import { describe } from 'mocha';
import { expect } from 'chai';
import Sinon from 'sinon';
import * as ejsTemplating from '../lib/ejs-templating';
import * as fsCb from 'fs';

const fs = fsCb.promises;

const TEST_TEMPLATE = '<html><body><h1>Hello</h1></body></html>';

describe('Ejs::', function () {
  let sandbox: Sinon.SinonSandbox;
  const stubs: any = {};

  beforeEach(() => {
    sandbox = Sinon.createSandbox();
    stubs.readFileStub = sandbox.stub(fs, 'readFile').resolves(TEST_TEMPLATE);
    stubs.consoleErrStub = sandbox.stub(console, 'error').returns();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('Should be able to render an HTML template string from a file', async () => {
    const templateString = await ejsTemplating.createTemplateFromFile('test/path', {});
    expect(templateString).to.equal(TEST_TEMPLATE);
    expect(stubs.readFileStub.callCount).to.equal(1);
  });

  it('Should error out if templating fails', async () => {
    stubs.readFileStub.rejects(Error('Error'));
    try {
      const templateString = await ejsTemplating.createTemplateFromFile('test/path', {});
      expect(templateString).to.be.undefined;
    } catch (err) {
      expect((err as Error).message).to.equal('Issue rendering your requested template');
      expect(stubs.readFileStub.callCount).to.equal(1);
    }
  });

  it('Should be able to render an HTML template string from a given string', async () => {
    const templateString = await ejsTemplating.createTemplateFromString(TEST_TEMPLATE, {});
    expect(templateString).to.equal(TEST_TEMPLATE);
    expect(stubs.readFileStub.callCount).to.equal(0);
  });

  it('Should error out if the given template string is empty', async () => {
    try {
      const templateString = await ejsTemplating.createTemplateFromString('', {});
      expect(templateString).to.be.undefined;
    } catch (err) {
      expect((err as Error).message).to.equal('Given template string was empty');
      expect(stubs.readFileStub.callCount).to.equal(0);
    }
  });
});
