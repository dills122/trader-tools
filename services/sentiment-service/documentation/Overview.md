# General Overview

This service is used to aggregate data from social sources and analyze any relevant conversations found through those social sources.

## Tech Overview

This is a Typescript Node.js package.

Packages Used:

* `natural` - used for language processing and sentiment analysis
* `apos-to-lex-form` - used in the text sanitation process
* `spelling-corrector` - used in the text sanitation process
* `stopword` - used in the text sanitation process to strip common stop words
* `word-list` - used in the text sanitation process to strip common words
* `bad-words` - used in the text sanitation process tp identify and strip mature language
* `is-ticker-symbol` - (My package) used to detect and extract equity/ticker symbols from text
* `api-service` - (My package) reaches out to the external social sources for data

## Generic Example

Generic Service Flow Diagram

![Generic Service Flow Diagram](./Generic%20Sentiment%20Process.png)

<div style="page-break-after: always"></div>

```typescript
import { Services } from 'sentiment-service';

const service = new Services.Generic.GenericSentimentAnalysisService({
    analyzer: 'natural',
    serviceAnalysisType: 'front-page',
    socialSource: 'reddit',
    filterFlags: {
    discussionMode: true
    },
    subreddit: 'wallstreetbets'
});

try {
    const results = await service.analyze();
} catch (err) {
    //Handle Err
}
```

And the output schema from this would have this shape:

```typescript
export interface AggregatedRefinedSentimentData {
  symbol: string;
  conversationEntityCount: number;
  conversationPostiveCount: number;
  conversationNegativeCount: number;
  conversationNeutralCount: number;
  positiveSentiment: number;
  negativeSentiment: number;
  neutralSentiment: number;
  sentimentScore: number;
}
```

<div style="page-break-after: always"></div>

## Under the Hood

### Individual Components of a Service

Individual sentiment services all follow a very specific design and flow that's key parts will be described below:

1. Service - parent type, executes 1 or a number of different sentiment analysis strategies
2. Service/Strategy (Data Source Specific) - a specific data source analysis strategy
3. Gatherer - gathers the requested data from the defined social data source
4. Filter - limits the data set gathered by the gatherer, removes all unwanted/non-match entities
5. Analyzer - refines each filtered discussion entity and runs sentiment analysis
6. Transformer - maps a data source specific analysis results to a generic schema
7. Refiner - refines and aggregates sentiment analysis results
8. Extractor - mainly used by filters to help extract desired information from the discussion threads

<div style="page-break-after: always"></div>

Component Flow Diagram

![Component Flow Diagram](./Component%20Flow.png)