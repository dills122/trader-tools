import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { ServiceConfigItem } from './shared';

export default <T, B>(
  config: ServiceConfigItem,
  credentials: grpc.ChannelCredentials,
  serverAddress: string
): B => {
  const packageDef = protoLoader.loadSync(config.protoPath);
  const grpcObj = (grpc.loadPackageDefinition(packageDef) as unknown) as T;

  return new grpcObj[config.namespace][config.serviceName](serverAddress, credentials);
};
