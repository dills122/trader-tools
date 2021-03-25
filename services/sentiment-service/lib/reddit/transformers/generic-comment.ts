import { GenericSentimentAnalysisResult } from "../../sharedTypes";
import { CommentListAnalyzerResult, SentimentAnalysisResultExtended } from "../analyzers/comment-list-sentiment-analyzer";

export const transform = (obj: SentimentAnalysisResultExtended, subreddit: string, title?: string): GenericSentimentAnalysisResult => {
    return {
        content: obj.standardizedInput,
        score: obj.score,
        sentimentStatus: obj.status,
        source: 'reddit',
        sourceKey: subreddit,
        stanardizedContent: obj.comment,
        symbol: obj.tickerSymbol,
        title: title
    };
};

export const transformList = (analysisObject: CommentListAnalyzerResult): GenericSentimentAnalysisResult[] => {
    const aggregatedResults: GenericSentimentAnalysisResult[] = [];

    for (const entry of [...analysisObject.negativeComments, ...analysisObject.neutralComments, ...analysisObject.positiveComments]) {
        aggregatedResults.push(transform(entry, analysisObject.subreddit, analysisObject.title));
    }
    return aggregatedResults;
};
