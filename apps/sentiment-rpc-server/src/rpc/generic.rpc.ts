import grpcTools from 'grpc-tools';

import config from '../proto.config';

const { GenericSentimentService } = config.Services;
import { ProtoGrpcType } from '../../generated/generic';
import { GenericSentimentServiceClient } from '../../generated/generic/GenericSentimentService';
import { AnalysisRequest } from '../../generated/generic/AnalysisRequest';

export default async (args: AnalysisRequest) => {
  const rpcClient = await grpcTools.clientFactory<ProtoGrpcType, GenericSentimentServiceClient>(
    GenericSentimentService
  );

  const deadline = new Date();
  deadline.setSeconds(deadline.getSeconds() + 5);
  rpcClient.waitForReady(deadline, (error?: Error) => {
    if (error) {
      console.log(`Client connect error: ${error.message}`);
    } else {
      rpcClient.Analyze(args, (err, response) => {
        if (err) {
          throw err;
        }
        if (!response) {
          throw Error('No response returned');
        }
        return response.analysisResults;
      });
    }
  });
};
