import { RebaseTickerList } from './rebase-ticker-list';

(async () => {
    const RebaseInst = new RebaseTickerList();
    try {
        console.log('Starting Rebase Service');
        await RebaseInst.rebase();
        console.log('Rebase Service Finished Successfully');
        process.exit(0);
    } catch (err) {
        console.error('Rebase Service Finished With Errors');
        console.error(err);
        process.exit(1);
    }
})();