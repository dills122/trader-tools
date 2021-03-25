import { RebaseTickerList } from './rebase-ticker-list';
import meow from 'meow';

const cli = meow(`
	Usage
	  $ execute

	Options
	  --exclude, -x  exclude specific sources
      --filter, -f type of tickers you want

	Examples
	  $ execute
	  
`, {
    booleanDefault: undefined,
    flags: {
        exclude: {
            type: 'string',
            alias: 'x'
        },
        filter: {
            type: 'string',
            alias: 'f'
        }
    }
});

const checkCLIArgs = () => {
    const cmd = cli.input[0];
    const isExecute = cmd === 'execute';
    if (cmd && !isExecute) {
        throw Error('Incorrect command given');
    }
    const flags = cli.flags;
    const excludedSources = flags['exclude'] || '';
    return {
        excludedSources: excludedSources.split(','),
        filterType: flags.filter
    };
};

(async () => {
    try {
        const args = checkCLIArgs();
        const RebaseInst = new RebaseTickerList({
            excludedSources: args.excludedSources.length > 0 ? args.excludedSources : undefined,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            filterType: <any>args.filterType
        });
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