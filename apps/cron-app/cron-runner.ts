import cron from 'node-cron';
import express from 'express';
import { Week52Low } from 'trading-services';

const app = express();

//Runs at 4:35 PM Mon-Fri.
cron.schedule('35 16 * * 1-5', () => {
    Week52Low.service().then(() => {
        console.log('Finished running service');
    }).catch((err) => {
        console.log(err);
    });
});

app.listen(3000);