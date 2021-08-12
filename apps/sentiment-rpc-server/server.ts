import * as grpc from '@grpc/grpc-js';
import grpcTools from 'grpc-tools';
import fs from 'fs';
import path from 'path';
import { buildHostStr } from './src/util/host';

import config from './src/proto.config';

function getServer(): grpc.Server {
  const server = grpcTools.serverFactory(config, new grpc.Server());
  return server;
}

function getCredentials(): grpc.ServerCredentials {
  if (process.env.isInsecure) {
    return grpc.ServerCredentials.createInsecure();
  } else {
    return grpc.ServerCredentials.createSsl(
      fs.readFileSync(path.join(process.cwd(), 'certs', 'ca.cert')),
      [
        {
          private_key: fs.readFileSync(path.join(process.cwd(), 'certs', 'service.key')),
          cert_chain: fs.readFileSync(path.join(process.cwd(), 'certs', 'service.pem'))
        }
      ],
      true
    );
  }
}

if (require.main === module) {
  const server = getServer();
  const creds = getCredentials();
  const serverAddress = buildHostStr();
  server.bindAsync(serverAddress, creds, (err: Error | null, port: number) => {
    if (err) {
      console.error(`Server error: ${err.message}`);
    } else {
      console.log(`Server bound on port: ${port}`);
      server.start();
    }
  });
}
