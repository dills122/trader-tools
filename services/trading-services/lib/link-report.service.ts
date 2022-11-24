import { mjml } from 'templating-service';
import { LinkGenerator } from 'trader-sdk';
import { Emailer } from 'shared-sdk';

export const service = async (): Promise<void> => {
  try {
    const linkObjects = LinkGenerator.generateLinkList();
    const renderedTemplate = await mjml.createTemplateFromFile('link-report.template.mjml', {
      stockLinks: linkObjects
    });
    await Emailer.sendEmail({
      html: renderedTemplate,
      subject: 'Link Report',
      email: 'insidertradingtips1220@gmail.com'
    });
  } catch (err) {
    console.error(err);
    throw Error('Error creating Link Report');
  }
};
