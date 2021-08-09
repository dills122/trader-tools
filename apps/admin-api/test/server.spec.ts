import Lab from '@hapi/lab';
import { expect } from '@hapi/code';
const { describe, it } = (exports.lab = Lab.script());
import server from '../src/server';

describe('Server', () => {
  it('initialize returns server object', async () => {
    const serverObj = await server.initialize();
    expect(serverObj).exists();
  });

  it('should be able to register routes after intializing', async () => {
    const serverObj = await server.initialize();
    expect(serverObj).exists();
    await server.register();
  });
  it('should be able to register routes after intializing', async () => {
    expect(server.register()).rejects();
  });
});
