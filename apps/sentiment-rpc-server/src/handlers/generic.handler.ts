import * as grpc from '@grpc/grpc-js';
import { Services } from 'sentiment-service';

import { AnalysisRequest } from '../../generated/generic/AnalysisRequest';
import { GenericSentimentServiceHandlers } from '../../generated/generic/GenericSentimentService';
import { AnalysisResponse } from '../../generated/generic/AnalysisResponse';

//TODO fix the types to hopefully not need this
export const isSentimentAnalysisServiceArgs = (
  object: any
): object is Services.Generic.SentimentAnalysisServiceArgs => {
  return object.socialSource === 'reddit' && object.analyzer === 'natural';
};

const genericHandler: GenericSentimentServiceHandlers = {
  Analyze(
    call: grpc.ServerUnaryCall<AnalysisRequest, AnalysisResponse>,
    callback: grpc.sendUnaryData<AnalysisResponse>
  ) {
    if (!call.request) {
      return callback(Error('No request found'));
    }

    if (!isSentimentAnalysisServiceArgs(call.request)) {
      return callback(Error('Incorrect request data'));
    }
    const service = new Services.Generic.GenericSentimentAnalysisService(call.request);

    service
      .analyze()
      .then((response) => {
        return callback(null, {
          analysisResults: response
        });
      })
      .catch((err) => {
        return callback(err);
      });
  }
};

export default genericHandler;
