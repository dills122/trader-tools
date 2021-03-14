# Sentiment Service

Package responsible for gathering social data source's discussions and analyzing it for sentiment indicators.

## Supported Data Sources

1. Reddit

## Future Data Sources

1. Stocktwits
2. Twitter
3. Discord

## Architecture Overview

Individual sentiment services all follow a very specific design and flow thats key parts will be described below:

1. Service - parent type, executes 1 or a number of different sentiment analysis strategies
2. Service/Strategy (Data Source Specific) - a specific data source analysis strategy
3. Gatherer - gathers the requested data from the defined social data source
4. Filter - limits the data set gathered by the gatherer, removes all unwanted/non-match entities
5. Analyzer - refines each filtered discussion entity and runs sentiment analysis
6. Transformer - maps a data source specific analysis results to a generic schema
7. Refiner - refines and aggregates sentiment analysis results

## Testing

Currently there are 3 different types of test suites you can run:

1. `Unit` - the normal unit test cases; `npm run test`
2. `E2E` - runs a full e2e with real data from the social source; `npm run test:e2e`
3. `Integration` - runs a full e2e, but with test data; `npm run test:integration`
