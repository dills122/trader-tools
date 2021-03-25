import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + '/../../../.env' });

const send = require('gmail-send')({
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
    to: process.env.EMAIL_USERNAME,
    subject: 'Tips incoming'
});
export interface EmailArgs {
    email?: string,
    body?: string,
    html?: string,
    subject: string
}

export const sendEmail = async (args: EmailArgs): Promise<void> => {
    if((!args.body && !args.html)) {
        throw Error('Missing a required args, body or html is needed');
    }
    try {
        await send({
            text: args.body ? args.body : undefined,
            html: args.html ? args.html : undefined,
            to: args.email,
            subject: args.subject,
            
        });
    } catch (err) {
        console.log(err);
    }
};

export default sendEmail;