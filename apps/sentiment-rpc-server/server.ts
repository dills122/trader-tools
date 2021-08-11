import * as grpc from '@grpc/grpc-js';
import grpcTools from 'grpc-tools';
import fs from 'fs';
import path from 'path';

import config from './src/proto.config';

const host = '0.0.0.0:9090';

function getServer(): grpc.Server {
  const server = grpcTools.serverFactory(config);
  return server;
}

function getCredentials(): grpc.ServerCredentials {
  if (process.env.isInsecure) {
    return grpc.ServerCredentials.createInsecure();
  } else {
    return grpc.ServerCredentials.createSsl(
      fs.readFileSync(path.join(process.cwd(), 'certs', 'ca-cert.pem')),
      [
        {
          private_key: fs.readFileSync(path.join(process.cwd(), 'certs', 'server-key.pem')),
          cert_chain: fs.readFileSync(path.join(process.cwd(), 'certs', 'server-cert.pem'))
        }
      ],
      true
    );
  }
}

if (require.main === module) {
  const server = getServer();

  const creds = getCredentials();
  server.bindAsync(host, creds, (err: Error | null, port: number) => {
    if (err) {
      console.error(`Server error: ${err.message}`);
    } else {
      console.log(`Server bound on port: ${port}`);
      server.start();
    }
  });
}
