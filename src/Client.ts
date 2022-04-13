import { BaseProvider } from '@ethersproject/providers';
import { ethers, Wallet } from 'ethers';
import { CoreContracts } from './Contracts';

export class CoreClient {
  private _provider: BaseProvider;
  private _wallet?: Wallet;
  private _contracts: CoreContracts;

  constructor(provider: BaseProvider, wallet?: Wallet) {
    this._provider = provider;
    this._wallet = wallet;
    this._contracts = new CoreContracts(provider);
  }
}
