import { ethers, Wallet } from 'ethers';
import { CoreClient } from './Client';

export class ClientFactory {
  public static createBackendClient(rpc: string, privateKey?: Wallet) {
    const provider = new ethers.providers.JsonRpcProvider(rpc);

    if (privateKey) {
      return new CoreClient(provider, new Wallet(privateKey, provider));
    }

    return new CoreClient(provider);
  }

  public static createFrontendClient(
    webProvider: ethers.providers.ExternalProvider | ethers.providers.JsonRpcFetchFunc
  ) {
    const provider = new ethers.providers.Web3Provider(webProvider);

    return new CoreClient(provider);
  }
}
