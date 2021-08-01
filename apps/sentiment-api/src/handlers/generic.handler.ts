import * as grpc from '@grpc/grpc-js';
import { Services } from 'sentiment-service';

import { AnalysisRequest, AnalysisResponse } from './proto/generic/generic_pb';
import { GenericService, IGenericServer } from './proto/generic/generic_grpc_pb';

class GenericHandler implements IGenericServer {
  /**
   * Greet the user nicely
   * @param call
   * @param callback
   */
  Analyze = (
    call: grpc.ServerUnaryCall<AnalysisRequest, AnalysisResponse>,
    callback: grpc.sendUnaryData<AnalysisResponse>
  ): void => {
    const analysisRequest: AnalysisRequest = call.request.getClientMessage();
    const reply: AnalysisResponse = new AnalysisResponse();

    const service = new Services.Generic.GenericSentimentAnalysisService(analysisRequest);

    service
      .analyze()
      .then((response) => {
        reply.setMessage({
          SentimentAnalysisResult: response
        });
        return callback(reply);
      })
      .catch((err) => {
        return callback(err);
      });

    callback(null, reply);
  };
}

export default {
  service: GenericService, // Service interface
  handler: new GenericHandler() // Service interface definitions
};
