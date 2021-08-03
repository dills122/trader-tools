const { join } = require('path');
const protoDefinitionPath = 'protos';

import GenericService from './handlers/generic.handler';

export default {
  protoDefinitionPath,
  Services: {
    GenericSentimentService: {
      protoPath: globalFilePaths('/generic/generic.proto'),
      namespace: 'generic',
      serviceName: 'GenericSentimentService',
      serviceDefinitions: GenericService
    }
  }
};
function globalFilePaths(path) {
  return join(__dirname, protoDefinitionPath, path);
}
