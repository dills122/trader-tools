import * as ejs from './ejs-templating';
import mjml from 'mjml';

export const createTemplateFromFile = async (
  templateLocation: string,
  templateData: Record<string, unknown>
): Promise<string> => {
  let renderedTemplate: string;
  try {
    renderedTemplate = await ejs.createTemplateFromFile(templateLocation, templateData);
  } catch (err) {
    console.error(err);
    throw Error('Issue rendering your requested template');
  }
  if (renderedTemplate.length === 0) {
    throw Error('Rendered templated was returned empty');
  }
  const renderedEmailResults = mjml(renderedTemplate);
  if (renderedEmailResults.errors.length >= 1) {
    throw Error('Error with rendering template with mjml');
  }
  if (!renderedEmailResults.html) {
    throw Error('Email template render completed, but with an empty string');
  }
  return renderedEmailResults.html;
};

export const createTemplateFromString = (
  templateString: string,
  templateData: Record<string, unknown>
): string => {
  if (templateString.length === 0) {
    throw Error('Given template string was empty');
  }
  const renderedTemplate = ejs.createTemplateFromString(templateString, templateData);

  if (renderedTemplate.length === 0) {
    throw Error('Rendered templated was returned empty');
  }
  const renderedEmailResults = mjml(renderedTemplate);
  if (renderedEmailResults.errors.length >= 1) {
    throw Error('Error with rendering template with mjml');
  }
  if (!renderedEmailResults.html) {
    throw Error('Email template render completed, but with an empty string');
  }
  return renderedEmailResults.html;
};
