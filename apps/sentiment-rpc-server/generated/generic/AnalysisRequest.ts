// Original file: src/proto/generic/generic.proto

export interface AnalysisRequest {
  socialSource?: string;
  analyzer?: string;
  serviceAnalysisType?: string;
  subreddit?: string;
}

export interface AnalysisRequest__Output {
  socialSource?: string;
  analyzer?: string;
  serviceAnalysisType?: string;
  subreddit?: string;
}
