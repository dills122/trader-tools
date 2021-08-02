import * as grpc from '@grpc/grpc-js';
import grpcTools from 'grpc-tools';

import config from './src/proto.config';

const host = '0.0.0.0:9090';

function getServer(): grpc.Server {
  const server = grpcTools.serverFactory(config);
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
