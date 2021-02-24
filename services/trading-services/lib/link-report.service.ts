import { mjml } from 'templating-service';
import { Emailer, LinkGenerator } from 'trader-sdk';

export const service = async () => {
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
    } catch(err) {
        console.log(err);
        throw Error('Error creating Link Report');
    }
};