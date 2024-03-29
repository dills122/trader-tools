import cron from 'node-cron';
import express from 'express';
import { Week52Low, FastSlowSma, LinkReport, SocialSentimentReport } from 'trading-services';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.CRON_PORT || 3000;

const app = express();

//Runs at 4:35 PM Mon-Fri.
cron.schedule('35 16 * * 1-5', () => {
  Promise.all([Week52Low.service()])
    .then(() => {
      console.log('Finished running service');
    })
    .catch((err) => {
      console.error('Finished running with errors');
      console.error(err);
    });
});

//Runs at 8:00 AM Mon-Fri.
cron.schedule('0 8 * * 1-5', () => {
  Promise.all([LinkReport.service(), SocialSentimentReport.service()])
    .then(() => {
      console.log('Finished running service');
    })
    .catch((err) => {
      console.error('Finished running with errors');
      console.error(err);
    });
});

//Runs at 4:35 PM Every Friday
cron.schedule('35 16 * * 5', () => {
  Promise.all([FastSlowSma.service()])
    .then(() => {
      console.log('Finished running service');
    })
    .catch((err) => {
      console.error('Finished running with errors');
      console.error(err);
    });
});

app.listen(PORT, () => {
  console.log('Cron Server Up and Running');
});
