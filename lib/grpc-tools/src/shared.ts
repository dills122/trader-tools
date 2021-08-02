import grpc from '@grpc/grpc-js';

export interface ServiceConfigItem {
  protoPath: string;
  namespace: string;
  serviceName: string;
  serviceDefinitions: grpc.UntypedServiceImplementation;
}

export interface ServiceConfig {
  protoDefinitionPath: string;
  Services: {
    [key: string]: ServiceConfigItem;
  };
}

export interface ServicePackageItem extends ServiceConfigItem {
  pkgDef: grpc.GrpcObject; //Need to update to proper type
}
