import { describe } from 'mocha';
import { expect } from 'chai';
import Sinon from 'sinon';
import * as mustacheTemplating from '../lib/mustache-templating';
import mustache from 'mustache';
import * as fsCb from 'fs';

const fs = fsCb.promises;

const TEST_TEMPLATE = '<html><body><h1>Hello</h1></body></html>';


describe('Mustache::', function () {
    let sandbox: Sinon.SinonSandbox;
    let stubs: any = {};

    beforeEach(() => {
        sandbox = Sinon.createSandbox();
        stubs.readFileStub = sandbox.stub(fs, 'readFile').resolves(TEST_TEMPLATE);
        stubs.mustacheRenderStub = sandbox.stub(mustache, 'render').resolves(TEST_TEMPLATE);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('Should be able to render an HTML template string from a file', async () => {
        const templateString = await mustacheTemplating.createTemplateFromFile('test/path', {});
        expect(templateString).to.equal(TEST_TEMPLATE);
        expect(stubs.readFileStub.callCount).to.equal(1);
        expect(stubs.mustacheRenderStub.callCount).to.equal(1);
    });

    it('Should error out if templating fails', async () => {
        stubs.readFileStub.rejects(Error('Error'));
        try {
            const templateString = await mustacheTemplating.createTemplateFromFile('test/path', {});
            expect(templateString).to.be.undefined;
        } catch (err) {
            expect(err.message).to.equal('Issue rendering your requested template');
            expect(stubs.readFileStub.callCount).to.equal(1);
            expect(stubs.mustacheRenderStub.callCount).to.equal(0);
        }
    });

    it('Should be able to render an HTML template string from a given string', async () => {
        const templateString = await mustacheTemplating.createTemplateFromString(TEST_TEMPLATE, {});
        expect(templateString).to.equal(TEST_TEMPLATE);
        expect(stubs.readFileStub.callCount).to.equal(0);
        expect(stubs.mustacheRenderStub.callCount).to.equal(1);
    });

    it('Should error out if the given template string is empty', async () => {
        try {
            const templateString = await mustacheTemplating.createTemplateFromString('', {});
            expect(templateString).to.be.undefined;
        } catch (err) {
            expect(err.message).to.equal('Given template string was empty');
            expect(stubs.readFileStub.callCount).to.equal(0);
            expect(stubs.mustacheRenderStub.callCount).to.equal(0);
        }
    });
});