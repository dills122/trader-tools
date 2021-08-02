import grpc from '@grpc/grpc-js';
import serverBuilder from './proto-server-builder';
import { ServiceConfig } from './shared';

const server_address = '0.0.0.0:50051'; //TODO update as arg

export default async (serverDefinitions: ServiceConfig): Promise<void> => {
  const server = serverBuilder(serverDefinitions);
  server.bind(server_address, grpc.ServerCredentials.createInsecure());
  server.start();
  console.log('Server Started');
};
