import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import _ from 'lodash';
import joi from 'joi';
import { ServiceConfig, ServicePackageItem } from './shared';

const schema = joi.object().keys({
  protoPath: joi
    .string()
    .min(1)
    .pattern(/[.](proto\b)/)
    .required(),
  namespace: joi.string().min(1).required(),
  serviceName: joi.string().min(1).required(),
  serviceDefinitions: joi.object().required()
});

//Load all of the protos into packages
export default (config: ServiceConfig): ServicePackageItem[] => {
  const protoServices = _.keys(config.Services);
  if (protoServices.length === 0 || _.isEmpty(config)) {
    throw new ReferenceError("config did not have any proto's defined");
  }

  return _.map(protoServices, (serviceName) => {
    const protoDefinition = config.Services[serviceName];
    joi.attempt(protoDefinition, schema);
    if (_.isEmpty(protoDefinition)) {
      throw new ReferenceError(`${serviceName} was supplied with an empty service defintion`);
    }
    const packageDefinition = protoLoader.loadSync(protoDefinition.protoPath, {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true
    });
    return {
      pkgDef: grpc.loadPackageDefinition(packageDefinition),
      ...protoDefinition
    };
  });
};
