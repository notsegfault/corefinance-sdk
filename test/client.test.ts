import { ClientFactory, CoreClient } from '../src';

const rpc = 'https://eth-rpc.gateway.pokt.network';

describe('Core Finance SDK', () => {
  it('creates a backend client from the factory', async () => {
    const client = await ClientFactory.createBackendClient(rpc);
    expect(client).not.toBe(null);
  });

  describe('lending module', () => {
    let client: CoreClient;
    beforeEach(async () => {
      client = await ClientFactory.createBackendClient(rpc);
    });

    it('returns the user lending stats', async () => {
      const stats = await client.lending.getUserStats('0xe743671e61d73e04daaeb0d8c70050a7a7516e60');
      console.log(stats);
      expect(stats).toBeDefined();
    });
  });
});
