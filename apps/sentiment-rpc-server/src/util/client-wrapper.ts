import * as grpcTools from 'grpc-tools';
import * as grpc from '@grpc/grpc-js';
import { buildHostStr } from './host';

export default <A, B>(
  config: grpcTools.shared.ServiceConfigItem,
  credentials: grpc.ChannelCredentials
): B => {
  const serverAddress = buildHostStr();
  return grpcTools.clientFactory<A, B>(config, credentials, serverAddress);
};
