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
    body: string,
    subject: string
};

export const sendEmail = async (args: EmailArgs) => {
    try {
        await send({
            text: args.body,
            to: args.email,
            subject: args.subject
        });
    } catch (err) {
        console.log(err);
    }
};

export default sendEmail;