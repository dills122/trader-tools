import { RebaseTickerList } from './rebase-ticker-list';

(async () => {
    const RebaseInst = new RebaseTickerList();
    try {
        await RebaseInst.rebase();
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
})();