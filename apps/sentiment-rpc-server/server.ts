import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { ProtoGrpcType } from './generated/generic';
import GenericHandler from './src/handlers/generic.handler';

const host = '0.0.0.0:9090';

function getServer(): grpc.Server {
  const packageDefinition = protoLoader.loadSync('./src/proto/generic/generic.proto');
  const proto = (grpc.loadPackageDefinition(packageDefinition) as unknown) as ProtoGrpcType;
  const server = new grpc.Server();
  server.addService(proto.generic.GenericSentimentService.service, GenericHandler.handler);
  return server;
}

if (require.main === module) {
  const server = getServer();
  server.bindAsync(host, grpc.ServerCredentials.createInsecure(), (err: Error | null, port: number) => {
    if (err) {
      console.error(`Server error: ${err.message}`);
    } else {
      console.log(`Server bound on port: ${port}`);
      server.start();
    }
  });
}
