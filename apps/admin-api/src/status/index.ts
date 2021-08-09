import Hapi from '@hapi/hapi';

export default {
  name: 'status',
  register: async (server: Hapi.Server): Promise<void> => {
    return server.route({
      method: 'GET',
      path: '/status',
      handler: function () {
        return 'Server is up and running';
      }
    });
  }
};
