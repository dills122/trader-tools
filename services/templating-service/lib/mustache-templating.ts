import * as Mustache from 'mustache';
import * as fsCb from 'fs';

const fs = fsCb.promises;

export const createTemplateFromFile = async (templateLocation: string, templateData: object) => {
    try {
        const template = await fs.readFile(templateLocation, { encoding: 'utf8' });
        const renderedTemplate = Mustache.render(template, templateData);
        if (renderedTemplate.length === 0) {
            throw Error('Rendered templated was returned empty');
        }
        return renderedTemplate;
    } catch (err) {
        throw Error('Issue rendering your requested template');
    }
};

export const createTemplateFromString = (templateString: string, templateData: object) => {
    if (templateString.length === 0) {
        throw Error('Given template string was empty');
    }
    const renderedTemplate = Mustache.render(templateString, templateData);
    if (renderedTemplate.length === 0) {
        throw Error('Rendered templated was returned empty');
    }
    return renderedTemplate;
};