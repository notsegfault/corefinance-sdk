import { ethers, Wallet } from 'ethers';
import { Provider } from 'ethers-multicall';
import { CoreClient } from './client';

export class ClientFactory {
  public static async createBackendClient(rpc: string, privateKey?: Wallet): Promise<CoreClient> {
    const nativeProvider = new ethers.providers.JsonRpcProvider(rpc, 1);
    const provider = new Provider(nativeProvider);
    await provider.init();

    if (privateKey) {
      return new CoreClient(provider, new Wallet(privateKey, nativeProvider));
    }

    return new CoreClient(provider);
  }

  public static async createFrontendClient(
    webProvider: ethers.providers.ExternalProvider | ethers.providers.JsonRpcFetchFunc
  ): Promise<CoreClient> {
    const provider = new Provider(new ethers.providers.Web3Provider(webProvider, 1));
    await provider.init();

    return new CoreClient(provider);
  }
}
