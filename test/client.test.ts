import { ClientFactory, CoreClient } from '../src';

const rpc = 'https://eth-mainnet.alchemyapi.io/v2/TsLEJAhX87icgMO7ZVyPcpeEgpFEo96O';

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
      expect(stats).toBeDefined();
    });

    it('returns the global lending stats', async () => {
      const stats = await client.lending.getGlobalStats();
      expect(stats).toBeDefined();
    });

    it('returns the apy', async () => {
      const stats = await client.corevault.getApyStats();
      expect(stats).toBeDefined();
    });
  });
});
