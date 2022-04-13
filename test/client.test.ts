import { ClientFactory } from '../src';

const rpc = 'https://eth-rpc.gateway.pokt.network';

describe('Core Finance SDK', () => {
  it('creates a backend client from the factory', async () => {
    const client = ClientFactory.createBackendClient(rpc);

    expect(client).not.toBe(null);
  });
});
