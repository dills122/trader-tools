import * as grpc from '@grpc/grpc-js';
import grpcTools from 'grpc-tools';
import fs from 'fs';
import path from 'path';

import config from './src/proto.config';

const host = 'localhost:9090';
const ip = process.env.IP;
const port = process.env.PORT;

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
  const serverAddress = host && ip ? `${ip}:${port}` : host;
  server.bindAsync(serverAddress, creds, (err: Error | null, port: number) => {
    if (err) {
      console.error(`Server error: ${err.message}`);
    } else {
      console.log(`Server bound on port: ${port}`);
      server.start();
    }
  });
}
