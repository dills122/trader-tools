import { describe } from 'mocha';
import { expect, assert } from 'chai';
import Sinon from 'sinon';
import * as fsCb from 'fs';
import proxyquire from 'proxyquire';
const fs = fsCb.promises;

const TEST_TEMPLATE = '<html><body><h1>Hello</h1></body></html>';

const mjmlStub = Sinon.stub().returns({
  html: TEST_TEMPLATE,
  errors: [],
  json: {}
});
const mjmlTemplater = proxyquire('../lib/mjml-ejs-templating.ts', {
  mjml: mjmlStub
});

describe('Ejs-mjml::', function () {
  let sandbox: Sinon.SinonSandbox;
  let stubs: any = {};

  beforeEach(() => {
    sandbox = Sinon.createSandbox();
    stubs.readFileStub = sandbox.stub(fs, 'readFile').resolves(TEST_TEMPLATE);
    stubs.consoleErrStub = sandbox.stub(console, 'error').returns();
  });

  afterEach(() => {
    sandbox.restore();
    mjmlStub.returns({
      html: TEST_TEMPLATE,
      errors: [],
      json: {}
    });
  });

  it('Should be able to render an email template from a given file', async () => {
    const templateString = await mjmlTemplater.createTemplateFromFile('test/path', {});
    expect(templateString).to.equal(TEST_TEMPLATE);
  });

  it('Should fail to render an email template from a given file', async () => {
    mjmlStub.returns({
      html: null,
      errors: [Error('Error')],
      json: {}
    });
    try {
      const templateString = await mjmlTemplater.createTemplateFromFile('test/path', {});
      assert(!templateString);
    } catch (err) {
      assert(err);
      expect(err.message).to.equal('Error with rendering template with mjml');
    }
  });

  it('Should error out if templating fails', async () => {
    stubs.readFileStub.rejects(Error('Error'));
    try {
      const templateString = await mjmlTemplater.createTemplateFromFile('test/path', {});
      expect(templateString).to.be.undefined;
    } catch (err) {
      expect(err.message).to.equal('Issue rendering your requested template');
      expect(stubs.readFileStub.callCount).to.equal(1);
    }
  });

  it('Should be able to render an HTML template string from a given string', async () => {
    const templateString = await mjmlTemplater.createTemplateFromString(TEST_TEMPLATE, {});
    expect(templateString).to.equal(TEST_TEMPLATE);
    expect(stubs.readFileStub.callCount).to.equal(0);
  });

  it('Should error out if the given template string is empty', async () => {
    try {
      const templateString = await mjmlTemplater.createTemplateFromString('', {});
      expect(templateString).to.be.undefined;
    } catch (err) {
      expect(err.message).to.equal('Given template string was empty');
      expect(stubs.readFileStub.callCount).to.equal(0);
    }
  });
});
