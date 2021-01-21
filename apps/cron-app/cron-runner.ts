import cron from 'node-cron';
import express from 'express';
import { Week52Low, ShortBB } from 'trading-services';

const app = express();

//Runs at 4:35 PM Mon-Fri.
cron.schedule('35 16 * * 1-5', () => {
    Promise.all([Week52Low.service(), ShortBB.service()]).then(() => {
        console.log('Finished running service');
    }).catch((err) => {
        console.error('Finished running with errors');
        console.error(err);
    });
});

app.listen(3000);