import * as ejs from 'ejs';
import * as fsCb from 'fs';
import { join } from 'path';

const fs = fsCb.promises;

export const createTemplateFromFile = async (
  templateName: string,
  templateData: Record<string, unknown>
): Promise<string> => {
  try {
    const template = await fs.readFile(join(__dirname, '..', 'templates', templateName), {
      encoding: 'utf8'
    });
    const renderedTemplate = ejs.render(template, templateData);
    if (renderedTemplate.length === 0) {
      throw Error('Rendered templated was returned empty');
    }
    return renderedTemplate;
  } catch (err) {
    throw Error('Issue rendering your requested template');
  }
};

export const createTemplateFromString = (
  templateString: string,
  templateData: Record<string, unknown>
): string => {
  if (templateString.length === 0) {
    throw Error('Given template string was empty');
  }
  const renderedTemplate = ejs.render(templateString, templateData);
  if (renderedTemplate.length === 0) {
    throw Error('Rendered templated was returned empty');
  }
  return renderedTemplate;
};
