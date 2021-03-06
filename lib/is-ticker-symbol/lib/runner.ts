import { RebaseTickerList } from './rebase-ticker-list';

(async () => {
    const RebaseInst = new RebaseTickerList();
    try {
        await RebaseInst.rebase();
    } catch (err) {
        console.error(err);
    }
})();