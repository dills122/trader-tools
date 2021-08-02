import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import _ from 'lodash';

const server_address = 'localhost:50051'; //TODO update with arg

export default async (protoPath: string, serviceName: string, namespace = '') => {
  let proto;
  const PROTO_PATH = protoPath;
  const pkgDef = await protoLoader.load(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  });
  if (namespace && _.isString(namespace) && !_.isEmpty(namespace)) {
    proto = grpc.loadPackageDefinition(pkgDef)[namespace];
  } else {
    proto = grpc.loadPackageDefinition(pkgDef);
  }
  return new proto[serviceName](server_address, grpc.credentials.createInsecure());
};
