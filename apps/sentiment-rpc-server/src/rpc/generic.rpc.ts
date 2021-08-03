import grpcTools from 'grpc-tools';

import config from '../proto.config';

const { GenericSentimentService } = config.Services;
import { ProtoGrpcType } from '../../generated/generic';
import { GenericSentimentServiceClient } from '../../generated/generic/GenericSentimentService';
import { AnalysisRequest } from '../../generated/generic/AnalysisRequest';
import { SentimentAnalysisResult__Output } from '../../generated/generic/SentimentAnalysisResult';

export default (args: AnalysisRequest): Promise<SentimentAnalysisResult__Output[]> => {
  const rpcClient = grpcTools.clientFactory<ProtoGrpcType, GenericSentimentServiceClient>(
    GenericSentimentService
  );
  const deadline = new Date();
  deadline.setSeconds(deadline.getSeconds() + 5);
  return new Promise((resolve, reject) => {
    rpcClient.waitForReady(deadline, (error?: Error) => {
      if (error) {
        reject(Error('Client connection error'));
      } else {
        rpcClient.Analyze(args, (err, response) => {
          if (err) {
            return reject(err);
          }
          if (!response) {
            return reject(Error('No response returned'));
          }
          return resolve(response.analysisResults);
        });
      }
    });
  });
};
