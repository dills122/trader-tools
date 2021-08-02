import grpc from '@grpc/grpc-js';
import serverBuilder from './proto-server-builder';
import { ServiceConfig } from './shared';

export default (serverDefinitions: ServiceConfig): grpc.Server => {
  return serverBuilder(serverDefinitions);
};
