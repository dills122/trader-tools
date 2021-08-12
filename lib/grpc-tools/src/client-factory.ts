import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import { ServiceConfigItem } from './shared';

const server_address = 'localhost:50051'; //TODO update with arg

export default <T, B>(
  config: ServiceConfigItem,
  credentials: grpc.ChannelCredentials,
  serverAddress: string = server_address
): B => {
  const packageDef = protoLoader.loadSync(config.protoPath);
  const grpcObj = (grpc.loadPackageDefinition(packageDef) as unknown) as T;

  return new grpcObj[config.namespace][config.serviceName](serverAddress, credentials);
};
