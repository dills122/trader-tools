# Is Ticker Symbol

Ever need to check if a string of text might contain a ticker symbol or company name? ...No? Well, thats exactly what this package will help you accomplish.

## API

* `isTickerSymbol` - checks a string for a given ticker symbol. Has to be an exact match.
* `isCompanyName` - checks a string for a company name, by tolerance.

## Rebasing Ticker Data

To manually update the stored list of ticker data in the `config.json` file, you'll need to run the `lib/runner.js` file, which will pull data from a variety of sources to backfill this dataset.

The execution time of this is around 15-30 minutes at the moment.

## Dependencies

Currently this library is a bit heavy (11MB) due to the all the static data it comes with.

* `fuse.js` - Fuzzy matching library
* `lodash` - To help with sorting Fuzzy matches
