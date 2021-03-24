import { mjml } from 'templating-service';
import { Emailer, LinkGenerator, Logger } from 'trader-sdk';

const log = new Logger.default({
    isPretty: true,
    name: 'Link Report'
});

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
        log.error(err);
        throw Error('Error creating Link Report');
    }
};
