import * as grpc from '@grpc/grpc-js';
import path from 'path';
import fs from 'fs';

export default (): grpc.ChannelCredentials => {
  if (process.env.isInsecure) {
    return grpc.credentials.createInsecure();
  } else {
    return grpc.credentials.createSsl(
      fs.readFileSync(path.join(process.cwd(), 'certs', 'ca-cert.pem')),
      fs.readFileSync(path.join(process.cwd(), 'certs', 'server-key.pem')),
      fs.readFileSync(path.join(process.cwd(), 'certs', 'server-cert.pem'))
    );
  }
};
