import clientFactory from './src/client-factory';
import serverFactory from './src/server-factory';
import protoServerBuilder from './src/proto-server-builder';
import protoServiceBuilder from './src/proto-service-builder';
import * as shared from './src/shared';

export default {
  clientFactory,
  serverFactory,
  protoServerBuilder,
  protoServiceBuilder,
  shared
};

export { clientFactory, serverFactory, protoServerBuilder, protoServiceBuilder, shared };
