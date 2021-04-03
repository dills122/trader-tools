import { Socials } from 'api-service';
import { SentimentAnalyzer, SentimentAnalysisResult } from '../../analyze-sentiment';
import { SentimentConfig } from '../../sentiment.config';
import { AnalyzerOptions } from '../../shared-types';
import { InputStandardizer } from '../../standardize-input';
import { config } from '../config';

const FilterPatterns = config.tickerFilterPatterns;

export interface CommentListAnalyzerArgs {
  comments: Socials.Reddit.Types.CommentExtended[];
  title: string;
  subreddit: string;
  options?: AnalyzerOptions;
}

export interface CommentListAnalyzerResult {
  title: string;
  subreddit: string;
  positiveComments: SentimentAnalysisResultExtended[];
  negativeComments: SentimentAnalysisResultExtended[];
  neutralComments: SentimentAnalysisResultExtended[];
}

export interface SentimentAnalysisResultExtended extends SentimentAnalysisResult {
  comment: string[];
  tickerSymbol: string;
}

export class CommentListSentimentAnalyzer {
  private comments: Socials.Reddit.Types.CommentExtended[];
  private title: string;
  private subreddit: string;
  private positiveComments: SentimentAnalysisResultExtended[] = [];
  private negativeComments: SentimentAnalysisResultExtended[] = [];
  private neutralComments: SentimentAnalysisResultExtended[] = [];
  private standardizeOptions: AnalyzerOptions;

  constructor(args: CommentListAnalyzerArgs) {
    this.comments = args.comments;
    this.title = args.title;
    this.subreddit = args.subreddit;
    if (args.options) {
      this.standardizeOptions = args.options;
    }
  }

  analyze(): CommentListAnalyzerResult {
    console.log('Stanardizing Comment List');
    const standardizedComments = this.standardizeData();
    console.log('Analyzing Comment List');
    const analyzer = new SentimentAnalyzer();
    const analyizedComments = standardizedComments.map((standizedCommentData) => {
      return {
        ...standizedCommentData,
        ...analyzer.analyze(standizedCommentData.comment)
      };
    });
    console.log('Beginning Sentiment Filtering');
    const positiveComments = analyizedComments.filter((comment) => {
      return comment.score >= SentimentConfig.positive;
    });

    this.positiveComments = this.positiveComments.concat(positiveComments);

    const negativeComments = analyizedComments.filter((comment) => {
      return comment.score <= SentimentConfig.negative;
    });

    this.negativeComments = this.negativeComments.concat(negativeComments);

    const neutralComments = analyizedComments.filter((comment) => {
      return comment.score > SentimentConfig.negative && comment.score < SentimentConfig.positive;
    });

    this.neutralComments = this.neutralComments.concat(neutralComments);

    return {
      title: this.title,
      subreddit: this.subreddit,
      positiveComments: this.positiveComments,
      negativeComments: this.negativeComments,
      neutralComments: this.neutralComments
    };
  }

  private standardizeData() {
    const Standardizer = new InputStandardizer({
      options: this.standardizeOptions
    });

    return this.comments
      .map((comment) => {
        try {
          console.log('Standarizing Comment: ', comment.body);
          const standardizedComment = Standardizer.standardize(comment.body);
          const standardizedCommentWithoutTicker = Standardizer.scrubTickerFromInput(
            standardizedComment,
            comment.tickerSymbol,
            FilterPatterns
          );
          console.log('Standardized Comment: ', standardizedCommentWithoutTicker);
          return {
            ...comment,
            comment: standardizedCommentWithoutTicker
          };
        } catch (err) {
          return {
            ...comment,
            comment: []
          };
        }
      })
      .filter((obj) => obj.comment.length > 0);
  }
}
