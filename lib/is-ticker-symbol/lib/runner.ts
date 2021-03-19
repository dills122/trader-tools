import { RebaseTickerList } from './rebase-ticker-list';
import meow from 'meow';

const cli = meow(`
	Usage
	  $ execute

	Options
	  --exclude-sources, -x  Include a rainbow

	Examples
	  $ execute
	  
`, {
    booleanDefault: undefined,
    flags: {
        ['exclude-sources']: {
            type: 'string',
            alias: 'x'
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
    const excludedSources = flags['exclude-sources'];
    if (!excludedSources) {
        throw Error('Incorrect or no arg given with flag');
    }
    return excludedSources.split(',');
};

(async () => {
    const RebaseInst = new RebaseTickerList();
    try {
        const args = checkCLIArgs();
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