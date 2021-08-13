import config from '../../proto.config';

const { GenericSentimentService } = config.Services;
import { ProtoGrpcType } from '../../../generated/generic';
import { GenericSentimentServiceClient } from '../../../generated/generic/GenericSentimentService';
import { AnalysisRequest__Output } from '../../../generated/generic/AnalysisRequest';
import { SentimentAnalysisResult__Output } from '../../../generated/generic/SentimentAnalysisResult';
import buildCredentials from '../../util/client-credential-builder';
import clientFactoryWrapper from '../../util/client-wrapper';

export default (args: AnalysisRequest__Output): Promise<SentimentAnalysisResult__Output[]> => {
  const credentials = buildCredentials();
  const rpcClient = clientFactoryWrapper<ProtoGrpcType, GenericSentimentServiceClient>(
    GenericSentimentService,
    credentials
  );
  const deadline = new Date();
  deadline.setSeconds(deadline.getSeconds() + 5);
  return new Promise((resolve, reject) => {
    rpcClient.waitForReady(deadline, (error?: Error) => {
      if (error) {
        console.error(error);
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
