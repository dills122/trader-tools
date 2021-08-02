import type * as grpc from '@grpc/grpc-js';
import type { MessageTypeDefinition } from '@grpc/proto-loader';

import type {
  GenericSentimentServiceClient as _generic_GenericSentimentServiceClient,
  GenericSentimentServiceDefinition as _generic_GenericSentimentServiceDefinition
} from './generic/GenericSentimentService';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new (...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  generic: {
    AnalysisRequest: MessageTypeDefinition;
    AnalysisResponse: MessageTypeDefinition;
    GenericSentimentService: SubtypeConstructor<
      typeof grpc.Client,
      _generic_GenericSentimentServiceClient
    > & { service: _generic_GenericSentimentServiceDefinition };
    SentimentAnalysisResult: MessageTypeDefinition;
  };
}
