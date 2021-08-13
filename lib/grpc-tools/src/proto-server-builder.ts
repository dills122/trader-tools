import buildPackageDefinitions from './proto-service-builder';
import { ServiceConfig } from './shared';
import * as grpc from '@grpc/grpc-js';
import _ from 'lodash';

export default (config: ServiceConfig, server = new grpc.Server()): grpc.Server => {
  if (_.isEmpty(config)) {
    throw new ReferenceError('Service definitions need to be defined');
  }
  const pkgDefs = buildPackageDefinitions(config);
  _.forEach(pkgDefs, (pkgDefObj) => {
    const { pkgDef, serviceName, namespace, serviceDefinitions } = pkgDefObj;
    server.addService(pkgDef[namespace][serviceName].service, serviceDefinitions);
  });
  return server;
};
