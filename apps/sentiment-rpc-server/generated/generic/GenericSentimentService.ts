// Original file: src/services/generic/generic.proto

import type * as grpc from '@grpc/grpc-js';
import type { MethodDefinition } from '@grpc/proto-loader';
import type {
  AnalysisRequest as _generic_AnalysisRequest,
  AnalysisRequest__Output as _generic_AnalysisRequest__Output
} from '../generic/AnalysisRequest';
import type {
  AnalysisResponse as _generic_AnalysisResponse,
  AnalysisResponse__Output as _generic_AnalysisResponse__Output
} from '../generic/AnalysisResponse';

export interface GenericSentimentServiceClient extends grpc.Client {
  Analyze(
    argument: _generic_AnalysisRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: (error?: grpc.ServiceError, result?: _generic_AnalysisResponse__Output) => void
  ): grpc.ClientUnaryCall;
  Analyze(
    argument: _generic_AnalysisRequest,
    metadata: grpc.Metadata,
    callback: (error?: grpc.ServiceError, result?: _generic_AnalysisResponse__Output) => void
  ): grpc.ClientUnaryCall;
  Analyze(
    argument: _generic_AnalysisRequest,
    options: grpc.CallOptions,
    callback: (error?: grpc.ServiceError, result?: _generic_AnalysisResponse__Output) => void
  ): grpc.ClientUnaryCall;
  Analyze(
    argument: _generic_AnalysisRequest,
    callback: (error?: grpc.ServiceError, result?: _generic_AnalysisResponse__Output) => void
  ): grpc.ClientUnaryCall;
  analyze(
    argument: _generic_AnalysisRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: (error?: grpc.ServiceError, result?: _generic_AnalysisResponse__Output) => void
  ): grpc.ClientUnaryCall;
  analyze(
    argument: _generic_AnalysisRequest,
    metadata: grpc.Metadata,
    callback: (error?: grpc.ServiceError, result?: _generic_AnalysisResponse__Output) => void
  ): grpc.ClientUnaryCall;
  analyze(
    argument: _generic_AnalysisRequest,
    options: grpc.CallOptions,
    callback: (error?: grpc.ServiceError, result?: _generic_AnalysisResponse__Output) => void
  ): grpc.ClientUnaryCall;
  analyze(
    argument: _generic_AnalysisRequest,
    callback: (error?: grpc.ServiceError, result?: _generic_AnalysisResponse__Output) => void
  ): grpc.ClientUnaryCall;
}

export interface GenericSentimentServiceHandlers extends grpc.UntypedServiceImplementation {
  Analyze: grpc.handleUnaryCall<_generic_AnalysisRequest__Output, _generic_AnalysisResponse>;
}

export interface GenericSentimentServiceDefinition extends grpc.ServiceDefinition {
  Analyze: MethodDefinition<
    _generic_AnalysisRequest,
    _generic_AnalysisResponse,
    _generic_AnalysisRequest__Output,
    _generic_AnalysisResponse__Output
  >;
}
