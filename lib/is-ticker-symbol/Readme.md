# Is Ticker Symbol

Ever need to check if a string of text might contain a ticker symbol or company name? ...No? Well, that's exactly what this package will help you accomplish.

Currently the list is only populated with Common Stock tickers to reduce the size and limit scope a bit.

## API

* `isTickerSymbol` - checks a string for a given ticker symbol. Has to be an exact match.
* `isCompanyName` - checks a string for a company name, by tolerance.

## Rebasing Ticker Data

To manually update the stored list of ticker data in the `config.json` file, you'll need to run the `lib/runner.js` file, which will pull data from a variety of sources to backfill this dataset.

The execution time of this is around 15-30 minutes at the moment.

### CLI Args

```
	Usage
	  $ execute

	Options
	  --exclude, -x  exclude specific sources
      --filter, -f type of tickers you want

	Examples
	  $ execute
```

## Dependencies

Currently this library is a bit heavy (11MB) due to the all the static data it comes with.

* `fuse.js` - Fuzzy matching library
* `lodash` - To help with sorting Fuzzy matches
